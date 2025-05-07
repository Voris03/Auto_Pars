import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
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

  const mockStats = {
    total: 2,
    byStatus: {
      [OrderStatus.PENDING]: 1,
      [OrderStatus.DELIVERED]: 1,
      [OrderStatus.PROCESSING]: 0,
      [OrderStatus.SHIPPED]: 0,
      [OrderStatus.CANCELLED]: 0,
    },
    averageOrderValue: 250,
  };

  // Вынесенные моки
  const createOrderMock = jest.fn();
  const findAllMock = jest.fn();
  const findOneMock = jest.fn();
  const updateStatusMock = jest.fn();
  const updateTrackingNumberMock = jest.fn();
  const getOrderStatisticsMock = jest.fn();

  beforeEach(async () => {
    createOrderMock.mockResolvedValue(mockOrder);
    findAllMock.mockResolvedValue([mockOrder]);
    findOneMock.mockResolvedValue(mockOrder);
    updateStatusMock.mockResolvedValue({ ...mockOrder, status: OrderStatus.PROCESSING });
    updateTrackingNumberMock.mockResolvedValue({ ...mockOrder, trackingNumber: 'TRACK123456' });
    getOrderStatisticsMock.mockResolvedValue(mockStats);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            createOrder: createOrderMock,
            findAll: findAllMock,
            findOne: findOneMock,
            updateStatus: updateStatusMock,
            updateTrackingNumber: updateTrackingNumberMock,
            getOrderStatistics: getOrderStatisticsMock,
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        shippingAddress: 'Test Address',
      };

      const result = await controller.createOrder({ user: mockUser }, createOrderDto);
      expect(result).toEqual(mockOrder);
      expect(service.createOrder).toHaveBeenCalledWith(mockUser, createOrderDto.shippingAddress);
    });
  });

  describe('findAll', () => {
    it('should return filtered orders', async () => {
      const result = await controller.findAll(
        { user: mockUser },
        OrderStatus.PENDING,
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result).toEqual([mockOrder]);
      expect(service.findAll).toHaveBeenCalledWith(
        mockUser,
        OrderStatus.PENDING,
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );
    });
  });

  describe('findOne', () => {
    it('should return order by id', async () => {
      const result = await controller.findOne({ user: mockUser }, 1);
      expect(result).toEqual(mockOrder);
      expect(service.findOne).toHaveBeenCalledWith(mockUser, 1);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const updateStatusDto: UpdateOrderStatusDto = {
        status: OrderStatus.PROCESSING,
      };

      const result = await controller.updateStatus({ user: mockUser }, 1, updateStatusDto);
      expect(result).toEqual({ ...mockOrder, status: OrderStatus.PROCESSING });
      expect(service.updateStatus).toHaveBeenCalledWith(mockUser, 1, updateStatusDto.status);
    });
  });

  describe('updateTrackingNumber', () => {
    it('should update tracking number', async () => {
      const updateTrackingDto: UpdateTrackingDto = {
        trackingNumber: 'TRACK123456',
      };

      const result = await controller.updateTrackingNumber({ user: mockUser }, 1, updateTrackingDto);
      expect(result).toEqual({ ...mockOrder, trackingNumber: 'TRACK123456' });
      expect(service.updateTrackingNumber).toHaveBeenCalledWith(
        mockUser,
        1,
        updateTrackingDto.trackingNumber,
      );
    });
  });

  describe('getStatistics', () => {
    it('should return order statistics', async () => {
      const result = await controller.getStatistics({ user: mockUser });
      expect(result).toEqual(mockStats);
      expect(service.getOrderStatistics).toHaveBeenCalledWith(mockUser);
    });
  });
}); 