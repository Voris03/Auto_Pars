import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../database/entities/cart.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { Product } from '../database/entities/product.entity'; // если нужно
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module'; // 💥 ЭТО ВАЖНО

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product]),
    ProductsModule, // 💥 Добавляем сюда
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}