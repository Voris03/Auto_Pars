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
    try {
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
        // totalAmount: 0,
      });

      await this.orderRepository.save(order);

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of cart.items) {
        const orderItem = this.orderItemRepository.create({
          order,
          product: cartItem.product,
          quantity: cartItem.quantity,
          price: cartItem.price,
          // subtotal: cartItem.price * cartItem.quantity,
        });

        orderItems.push(orderItem);
        // totalAmount += orderItem.subtotal;
      }

      await this.orderItemRepository.save(orderItems);
      // order.totalAmount = totalAmount;
      await this.orderRepository.save(order);

      // Clear the cart after successful order creation
      await this.cartService.clearCart(user);

      this.logger.log(
        `Order ${order.id} created successfully for user ${user.id}`,
      );
      return this.findOne(user, order.id);
    } catch (error) {
      this.logger.error(
        `Error creating order for user ${user.id}: ${error.message}`,
      );
      throw error;
    }
  }

  async findAll(
    user: User,
    status?: OrderStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Order[]> {
    try {
      this.logger.log(
        `Finding orders for user ${user.id} with filters: status=${status}, startDate=${startDate}, endDate=${endDate}`,
      );

      const queryBuilder = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.product', 'product')
        .where('order.user.id = :userId', { userId: user.id });

      if (status) {
        queryBuilder.andWhere('order.status = :status', { status });
      }

      if (startDate) {
        queryBuilder.andWhere('order.createdAt >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('order.createdAt <= :endDate', { endDate });
      }

      queryBuilder.orderBy('order.createdAt', 'DESC');

      const orders = await queryBuilder.getMany();
      this.logger.log(`Found ${orders.length} orders for user ${user.id}`);
      return orders;
    } catch (error) {
      this.logger.error(
        `Error finding orders for user ${user.id}: ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(user: User, orderId: string): Promise<Order> {
    try {
      this.logger.log(`Finding order ${orderId} for user ${user.id}`);
      const order = await this.orderRepository.findOne({
        where: { id: orderId, user: { id: user.id } },
        relations: ['items', 'items.product'],
      });

      if (!order) {
        this.logger.warn(`Order ${orderId} not found for user ${user.id}`);
        throw new NotFoundException('Order not found');
      }

      return order;
    } catch (error) {
      this.logger.error(
        `Error finding order ${orderId} for user ${user.id}: ${error.message}`,
      );
      throw error;
    }
  }

  async updateStatus(
    user: User,
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    try {
      this.logger.log(
        `Updating status of order ${orderId} to ${status} for user ${user.id}`,
      );
      const order = await this.findOne(user, orderId);

      if (
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.CANCELLED
      ) {
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
    } catch (error) {
      this.logger.error(
        `Error updating status of order ${orderId}: ${error.message}`,
      );
      throw error;
    }
  }

  async updateTrackingNumber(
    user: User,
    orderId: string,
    trackingNumber: string,
  ): Promise<Order> {
    try {
      this.logger.log(
        `Updating tracking number of order ${orderId} for user ${user.id}`,
      );
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
    } catch (error) {
      this.logger.error(
        `Error updating tracking number of order ${orderId}: ${error.message}`,
      );
      throw error;
    }
  }

  async getOrderStatistics(user: User): Promise<{
    total: number;
    byStatus: Record<OrderStatus, number>;
    averageOrderValue: number;
  }> {
    try {
      this.logger.log(`Getting order statistics for user ${user.id}`);
      const orders = await this.findAll(user);

      const byStatus = orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        {} as Record<OrderStatus, number>,
      );

      const total = orders.length;

      // TODO order.totalAmount
      const totalAmount = 100;
      const averageOrderValue =
        total > 0
          ? orders.reduce((sum, order) => sum + totalAmount, 0) / total
          : 0;

      return {
        total,
        byStatus,
        averageOrderValue,
      };
    } catch (error) {
      this.logger.error(
        `Error getting order statistics for user ${user.id}: ${error.message}`,
      );
      throw error;
    }
  }
}
