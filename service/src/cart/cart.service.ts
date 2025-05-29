import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../database/entities/cart.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { User } from '../database/entities/user.entity';

interface SnapshotProduct {
  name: string;
  price: number;
  brand?: string;
  image?: string;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  // Получить или создать корзину для пользователя
  async getOrCreateCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  // Добавить товар в корзину
  async addToCart(
    user: User,
    product: SnapshotProduct,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);

    // Поиск уже добавленного товара (по имени, бренду и цене)
    const existingItem = cart.items?.find(
      (item) =>
        item.productName === product.name &&
        item.price === product.price &&
        item.productBrand === product.brand,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        productName: product.name,
        productBrand: product.brand,
        productImage: product.image,
        quantity,
        price: product.price,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.getOrCreateCart(user);
  }

  // Обновить количество товара
  async updateCartItem(
    user: User,
    itemId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items?.find((i) => i.id === itemId);

    if (!item) throw new NotFoundException('Товар в корзине не найден');

    if (quantity <= 0) {
      await this.cartItemRepository.remove(item);
    } else {
      item.quantity = quantity;
      await this.cartItemRepository.save(item);
    }

    return this.getOrCreateCart(user);
  }

  // Удалить один товар
  async removeFromCart(user: User, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items?.find((i) => i.id === itemId);

    if (!item) throw new NotFoundException('Товар в корзине не найден');

    await this.cartItemRepository.remove(item);
    return this.getOrCreateCart(user);
  }

  // Очистить корзину полностью
  async clearCart(user: User): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);

    if (cart.items?.length) {
      await this.cartItemRepository.remove(cart.items);
    }

    return this.getOrCreateCart(user);
  }

  // Подсчитать общую сумму и количество товаров
  async calculateTotal(
    cart: Cart,
  ): Promise<{ total: number; itemsCount: number }> {
    const items = cart.items || [];

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const itemsCount = items.reduce((count, item) => count + item.quantity, 0);

    return { total, itemsCount };
  }
}