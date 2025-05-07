import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../database/entities/cart.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { Product } from '../database/entities/product.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async getOrCreateCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(
    user: User,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const existingItem = cart.items.find(
      (item) => item.product.id === productId.toString(),
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // const newItem = this.cartItemRepository.create({
      //   cart,
      //   product: { id: productId } as Product,
      //   quantity,
      //   price:
      //     (
      //       await this.cartItemRepository.findOne({
      //         where: { product: { id: productId } },
      //       })
      //     )?.price || 0,
      // });
      // await this.cartItemRepository.save(newItem);
    }

    return this.getOrCreateCart(user);
  }

  async updateCartItem(
    user: User,
    itemId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items.find((item) => item.id === itemId.toString());

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.cartItemRepository.remove(item);
    } else {
      item.quantity = quantity;
      await this.cartItemRepository.save(item);
    }

    return this.getOrCreateCart(user);
  }

  async removeFromCart(user: User, itemId: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items.find((item) => item.id === itemId.toString());

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(item);
    return this.getOrCreateCart(user);
  }

  async clearCart(user: User): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    await this.cartItemRepository.remove(cart.items);
    return this.getOrCreateCart(user);
  }

  async calculateTotal(
    cart: Cart,
  ): Promise<{ total: number; itemsCount: number }> {
    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemsCount = cart.items.reduce(
      (count, item) => count + item.quantity,
      0,
    );
    return { total, itemsCount };
  }
}
