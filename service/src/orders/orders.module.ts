import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { CartModule } from '../cart/cart.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule,          // Для получения и очистки корзины
    UsersModule,         // Если нужно расширять поведение через user
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Для возможности повторного использования
})
export class OrdersModule {}