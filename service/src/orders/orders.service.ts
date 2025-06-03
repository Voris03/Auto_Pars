import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { User } from '../database/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly cartService: CartService,
    private readonly userService: UsersService,
  ) {}
  
  async createOrder( reqUser: { userId: string }, dto: CreateOrderDto): Promise<Order> {
    const { shippingAddress, deliveryType, paymentMethod, cardInfo } = dto;
    const user = await this.userService.findOne(reqUser.userId);

    this.logger.log(`Создание заказа для пользователя ${user.id}`);

    const cart = await this.cartService.getOrCreateCart(user);

    if (!cart.items || cart.items.length === 0) {
      this.logger.warn(`Корзина пуста у пользователя ${user.id}`);
      throw new BadRequestException('Корзина пуста');
    }

    try {
      const order = this.orderRepository.create({
        user,
        shippingAddress,
        status: OrderStatus.PENDING,
        total: 0,
        contactPhone: user.phone ?? '',
        notes: `Доставка: ${deliveryType}, Оплата: ${paymentMethod}`,
      });

      await this.orderRepository.save(order);

      let total = 0;
      const orderItems = cart.items.map((item) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        return this.orderItemRepository.create({
          order,
          quantity: item.quantity,
          price: item.price,
          productSnapshot: {
            name: item.productName,
            brand: item.productBrand,
            image: item.productImage,
          },
        });
      });

      await this.orderItemRepository.save(orderItems);
      order.total = total;
      await this.orderRepository.save(order);

      await this.cartService.clearCart(user);

      this.logger.log(`Заказ ${order.id} создан для пользователя ${user.id}`);
      return this.findOne(user, order.id);
    } catch (error) {
      this.logger.error('Ошибка создания заказа', error);
      throw new InternalServerErrorException('Не удалось создать заказ');
    }
  }

  async findAll(
    user: User,
    status?: OrderStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Order[]> {
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where('order.user.id = :userId', { userId: user.id });

    if (status) qb.andWhere('order.status = :status', { status });
    if (startDate) qb.andWhere('order.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('order.createdAt <= :endDate', { endDate });

    qb.orderBy('order.createdAt', 'DESC');

    const orders = await qb.getMany();
    this.logger.log(
      `Найдено ${orders.length} заказов для пользователя ${user.id}`,
    );
    return orders;
  }

  async findOne(user: User, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: user.id } },
      relations: ['items'],
    });

    if (!order) {
      this.logger.warn(`Заказ ${orderId} не найден у пользователя ${user.id}`);
      throw new NotFoundException('Заказ не найден');
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
        `Нельзя изменить статус заказа ${orderId}, текущий: ${order.status}`,
      );
      throw new BadRequestException(`Нельзя изменить статус ${order.status}`);
    }

    order.status = status;
    const updated = await this.orderRepository.save(order);
    this.logger.log(`Обновлён статус заказа ${orderId} на ${status}`);
    return updated;
  }

  async updateTrackingNumber(
    user: User,
    orderId: string,
    trackingNumber: string,
  ): Promise<Order> {
    const order = await this.findOne(user, orderId);

    if (order.status !== OrderStatus.SHIPPED) {
      this.logger.warn(
        `Трек-номер нельзя задать заказу ${orderId} со статусом ${order.status}`,
      );
      throw new BadRequestException(
        'Трек-номер можно добавить только к отправленным заказам',
      );
    }

    order.trackingNumber = trackingNumber;
    const updated = await this.orderRepository.save(order);
    this.logger.log(`Добавлен трек-номер к заказу ${orderId}`);
    return updated;
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
    const sum = orders.reduce((acc, order) => acc + Number(order.total), 0);
    const averageOrderValue = total > 0 ? sum / total : 0;

    return {
      total,
      byStatus,
      averageOrderValue,
    };
  }
}
