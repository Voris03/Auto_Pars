import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../database/entities/cart.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { User } from '../database/entities/user.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly itemRepo: Repository<CartItem>,

    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(user: User): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['items'],
    });
    console.log("getOrCreateCart → user:", user.id);
    console.log("cart is getOrCreate", cart, "user", user )
    const carts = await this.cartRepo.count({where: {user: {id: user.id}}})
    console.log("cartsLenght", carts)
    if (!cart) {
      cart = this.cartRepo.create({ user });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addToCart(
    user: User,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const product = await this.productsService.findOneById(productId);
    if (!product) throw new NotFoundException('Продукт не найден');

    const existingItem = cart.items?.find(
      (item) =>
        item.productName === product.name &&
        item.price === product.price &&
        item.productBrand === product.brand,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.itemRepo.save(existingItem);
    } else {
      const newItem = this.itemRepo.create({
        cart,
        quantity,
        price: product.price,
        productName: product.name,
        productBrand: product.brand,
        productImage: product.images?.[0] ?? null,
      });
      await this.itemRepo.save(newItem);
    }

    return this.getOrCreateCart(user);
  }

  async updateCartItem(
    user: User,
    itemId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Товар не найден в корзине');

    if (quantity <= 0) {
      await this.itemRepo.remove(item);
    } else {
      item.quantity = quantity;
      await this.itemRepo.save(item);
    }

    // ✅ Обновим корзину
    cart.updatedAt = new Date();
    await this.cartRepo.save(cart);

    return this.getOrCreateCart(user);
  }

  async removeFromCart(user: User, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Товар не найден в корзине');

    await this.itemRepo.remove(item);

    cart.updatedAt = new Date();
    await this.cartRepo.save(cart);

    return this.getOrCreateCart(user);
  }

  async clearCart(user: User): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    if (cart.items?.length) {
      await this.itemRepo.remove(cart.items);
    }

    cart.updatedAt = new Date();
    await this.cartRepo.save(cart);

    return this.getOrCreateCart(user);
  }

  async calculateTotal(
    cart: Cart,
  ): Promise<{ total: number; itemsCount: number }> {
    const items = cart.items || [];
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemsCount };
  }
}
