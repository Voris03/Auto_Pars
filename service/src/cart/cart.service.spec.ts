import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;
  let cartItemRepository: Repository<CartItem>;

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
  };

  const mockCart = {
    id: 1,
    user: mockUser,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCartItem = {
    id: 1,
    cart: mockCart,
    product: { id: 1, name: 'Test Product', price: 100 },
    quantity: 1,
    price: 100,
  };

  const mockProduct: Partial<Product> = {
    id: 1,
    name: 'Test Product',
    price: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: 'ProductRepository',
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockProduct),
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

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateCart', () => {
    it('should return existing cart', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(mockCart as Cart);
      const result = await service.getOrCreateCart(mockUser as any);
      expect(result).toEqual(mockCart);
    });

    it('should create new cart if not exists', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(cartRepository, 'create').mockReturnValue(mockCart as Cart);
      jest.spyOn(cartRepository, 'save').mockResolvedValue(mockCart as Cart);

      const result = await service.getOrCreateCart(mockUser as any);
      expect(result).toEqual(mockCart);
      expect(cartRepository.create).toHaveBeenCalledWith({ user: mockUser });
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const cartWithItems = { ...mockCart, items: [] };
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartWithItems as Cart);
      jest.spyOn(cartItemRepository, 'create').mockReturnValue(mockCartItem as CartItem);
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(mockCartItem as CartItem);

      const result = await service.addToCart(mockUser as any, 1, 1);
      expect(result).toBeDefined();
      expect(cartItemRepository.create).toHaveBeenCalled();
    });

    it('should update existing item quantity', async () => {
      const cartWithItems = { ...mockCart, items: [mockCartItem] };
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartWithItems as Cart);
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(mockCartItem as CartItem);

      const result = await service.addToCart(mockUser as any, 1, 1);
      expect(result).toBeDefined();
      expect(cartItemRepository.save).toHaveBeenCalled();
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total and items count correctly', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [
          { ...mockCartItem, quantity: 2, price: 100 },
          { ...mockCartItem, id: 2, quantity: 3, price: 200 },
        ],
      };

      const result = await service.calculateTotal(cartWithItems as Cart);
      expect(result).toEqual({
        total: 800, // (2 * 100) + (3 * 200)
        itemsCount: 5, // 2 + 3
      });
    });
  });

  describe('removeFromCart', () => {
    it('should throw NotFoundException if item not found', async () => {
      const cartWithItems = { ...mockCart, items: [] };
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartWithItems as Cart);

      await expect(service.removeFromCart(mockUser as any, 999)).rejects.toThrow(NotFoundException);
    });

    it('should remove item from cart', async () => {
      const cartWithItems = { ...mockCart, items: [mockCartItem] };
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartWithItems as Cart);
      jest.spyOn(cartItemRepository, 'remove').mockResolvedValue(mockCartItem as CartItem);

      const result = await service.removeFromCart(mockUser as any, 1);
      expect(result).toBeDefined();
      expect(cartItemRepository.remove).toHaveBeenCalled();
    });
  });
}); 