import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let cartService: CartService;

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
  };

  const mockCart = {
    id: 1,
    user: mockUser,
    items: [
      {
        id: 1,
        product: { id: 1, name: 'Test Product', price: 100 },
        quantity: 2,
        price: 100,
      },
    ],
  };

  const mockOrder = {
    id: 1,
    user: mockUser,
    status: OrderStatus.PENDING,
    shippingAddress: 'Test Address',
    totalAmount: 200,
    items: [
      {
        id: 1,
        product: { id: 1, name: 'Test Product', price: 100 },
        quantity: 2,
        price: 100,
        subtotal: 200,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn().mockResolvedValue(mockOrder),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CartService,
          useValue: {
            getOrCreateCart: jest.fn(),
            clearCart: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      jest.spyOn(cartService, 'getOrCreateCart').mockResolvedValue(mockCart as any);
      jest.spyOn(orderRepository, 'create').mockReturnValue(mockOrder as Order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrder as Order);
      jest.spyOn(orderItemRepository, 'create').mockReturnValue(mockOrder.items[0] as OrderItem);
      jest.spyOn(orderItemRepository, 'save').mockResolvedValue(mockOrder.items[0] as OrderItem);

      const result = await service.createOrder(mockUser as any, 'Test Address');
      expect(result).toEqual(mockOrder);
      expect(cartService.clearCart).toHaveBeenCalled();
    });

    it('should throw BadRequestException if cart is empty', async () => {
      jest.spyOn(cartService, 'getOrCreateCart').mockResolvedValue({ ...mockCart, items: [] } as any);

      await expect(service.createOrder(mockUser as any, 'Test Address'))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return filtered orders', async () => {
      const mockOrders = [mockOrder];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockOrders),
      };

      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.findAll(
        mockUser as any,
        OrderStatus.PENDING,
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result).toEqual(mockOrders);
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('findOne', () => {
    it('should return order if found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(mockOrder as Order);

      const result = await service.findOne(mockUser as any, 1);
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(mockUser as any, 999))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(mockOrder as Order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.PROCESSING,
      } as Order);

      const result = await service.updateStatus(mockUser as any, 1, OrderStatus.PROCESSING);
      expect(result.status).toBe(OrderStatus.PROCESSING);
    });

    it('should throw BadRequestException if order is delivered or cancelled', async () => {
      const deliveredOrder = { ...mockOrder, status: OrderStatus.DELIVERED };
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(deliveredOrder as Order);

      await expect(service.updateStatus(mockUser as any, 1, OrderStatus.PROCESSING))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getOrderStatistics', () => {
    it('should return correct statistics', async () => {
      const orders = [
        { ...mockOrder, status: OrderStatus.PENDING, totalAmount: 200 },
        { ...mockOrder, id: 2, status: OrderStatus.DELIVERED, totalAmount: 300 },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(orders as Order[]);

      const result = await service.getOrderStatistics(mockUser as any);
      expect(result).toEqual({
        total: 2,
        byStatus: {
          [OrderStatus.PENDING]: 1,
          [OrderStatus.DELIVERED]: 1,
        },
        averageOrderValue: 250,
      });
    });
  });
}); 