import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
  };

  const mockCart = {
    id: 1,
    user: mockUser,
    items: [],
    total: 0,
    itemsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            getOrCreateCart: jest.fn(),
            addToCart: jest.fn(),
            updateCartItem: jest.fn(),
            removeFromCart: jest.fn(),
            clearCart: jest.fn(),
            calculateTotal: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCart', () => {
    it('should return cart with total and items count', async () => {
      const mockCartWithTotal = { ...mockCart, total: 0, itemsCount: 0 };
      jest.spyOn(service, 'getOrCreateCart').mockResolvedValue(mockCart as any);
      jest.spyOn(service, 'calculateTotal').mockResolvedValue({ total: 0, itemsCount: 0 });

      const result = await controller.getCart({ user: mockUser });
      expect(result).toEqual(mockCartWithTotal);
    });
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      const addToCartDto = { productId: 1, quantity: 1 };
      const mockCartWithTotal = { ...mockCart, total: 100, itemsCount: 1 };
      
      jest.spyOn(service, 'addToCart').mockResolvedValue(mockCart as any);
      jest.spyOn(service, 'calculateTotal').mockResolvedValue({ total: 100, itemsCount: 1 });

      const result = await controller.addToCart({ user: mockUser }, addToCartDto);
      expect(result).toEqual(mockCartWithTotal);
      expect(service.addToCart).toHaveBeenCalledWith(mockUser, addToCartDto.productId, addToCartDto.quantity);
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity', async () => {
      const mockCartWithTotal = { ...mockCart, total: 200, itemsCount: 2 };
      
      jest.spyOn(service, 'updateCartItem').mockResolvedValue(mockCart as any);
      jest.spyOn(service, 'calculateTotal').mockResolvedValue({ total: 200, itemsCount: 2 });

      const result = await controller.updateCartItem({ user: mockUser }, 1, 2);
      expect(result).toEqual(mockCartWithTotal);
      expect(service.updateCartItem).toHaveBeenCalledWith(mockUser, 1, 2);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockCartWithTotal = { ...mockCart, total: 0, itemsCount: 0 };
      
      jest.spyOn(service, 'removeFromCart').mockResolvedValue(mockCart as any);
      jest.spyOn(service, 'calculateTotal').mockResolvedValue({ total: 0, itemsCount: 0 });

      const result = await controller.removeFromCart({ user: mockUser }, 1);
      expect(result).toEqual(mockCartWithTotal);
      expect(service.removeFromCart).toHaveBeenCalledWith(mockUser, 1);
    });
  });

  describe('clearCart', () => {
    it('should clear cart', async () => {
      const mockCartWithTotal = { ...mockCart, total: 0, itemsCount: 0 };
      
      jest.spyOn(service, 'clearCart').mockResolvedValue(mockCart as any);
      jest.spyOn(service, 'calculateTotal').mockResolvedValue({ total: 0, itemsCount: 0 });

      const result = await controller.clearCart({ user: mockUser });
      expect(result).toEqual(mockCartWithTotal);
      expect(service.clearCart).toHaveBeenCalledWith(mockUser);
    });
  });
}); 