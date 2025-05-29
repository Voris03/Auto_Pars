import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { User } from '../database/entities/user.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    private cartService: CartService,
  ) {}

  async createOrder(user: User, shippingAddress: string): Promise<Order> {
    this.logger.log(`Creating order for user ${user.id}`);

    const cart = await this.cartService.getOrCreateCart(user);

    if (!cart.items.length) {
      this.logger.warn(
        `Attempt to create order with empty cart for user ${user.id}`,
      );
      throw new BadRequestException('Cart is empty');
    }

    const order = this.orderRepository.create({
      user,
      status: OrderStatus.PENDING,
      shippingAddress,
      total: 0,
    });

    await this.orderRepository.save(order);

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const cartItem of cart.items) {
      const subtotal = cartItem.price * cartItem.quantity;

      const orderItem = this.orderItemRepository.create({
        order,
        quantity: cartItem.quantity,
        price: cartItem.price,
        productSnapshot: {
          name: cartItem.productName,
          brand: cartItem.productBrand,
          image: cartItem.productImage,
        },
      });

      orderItems.push(orderItem);
      totalAmount += subtotal;
    }

    await this.orderItemRepository.save(orderItems);
    order.total = totalAmount;
    await this.orderRepository.save(order);

    await this.cartService.clearCart(user);

    this.logger.log(
      `Order ${order.id} created successfully for user ${user.id}`,
    );
    return this.findOne(user, order.id);
  }

  async findAll(
    user: User,
    status?: OrderStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where('order.user.id = :userId', { userId: user.id });

    if (status) queryBuilder.andWhere('order.status = :status', { status });
    if (startDate)
      queryBuilder.andWhere('order.createdAt >= :startDate', { startDate });
    if (endDate)
      queryBuilder.andWhere('order.createdAt <= :endDate', { endDate });

    queryBuilder.orderBy('order.createdAt', 'DESC');

    const orders = await queryBuilder.getMany();
    this.logger.log(`Found ${orders.length} orders for user ${user.id}`);
    return orders;
  }

  async findOne(user: User, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: user.id } },
      relations: ['items'],
    });

    if (!order) {
      this.logger.warn(`Order ${orderId} not found for user ${user.id}`);
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(
    user: User,
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.findOne(user, orderId);

    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      this.logger.warn(
        `Cannot update status of ${order.status} order ${orderId}`,
      );
      throw new BadRequestException(
        `Cannot update status of ${order.status} order`,
      );
    }

    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);
    this.logger.log(`Order ${orderId} status updated to ${status}`);
    return updatedOrder;
  }

  async updateTrackingNumber(
    user: User,
    orderId: string,
    trackingNumber: string,
  ): Promise<Order> {
    const order = await this.findOne(user, orderId);

    if (order.status !== OrderStatus.SHIPPED) {
      this.logger.warn(
        `Cannot add tracking number to order ${orderId} with status ${order.status}`,
      );
      throw new BadRequestException(
        'Tracking number can only be added to shipped orders',
      );
    }

    order.trackingNumber = trackingNumber;
    const updatedOrder = await this.orderRepository.save(order);
    this.logger.log(`Order ${orderId} tracking number updated`);
    return updatedOrder;
  }

  async getOrderStatistics(user: User): Promise<{
    total: number;
    byStatus: Record<OrderStatus, number>;
    averageOrderValue: number;
  }> {
    const orders = await this.findAll(user);

    const byStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );

    const total = orders.length;
    const totalAmount = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );
    const averageOrderValue = total > 0 ? totalAmount / total : 0;

    return {
      total,
      byStatus,
      averageOrderValue,
    };
  }
}
