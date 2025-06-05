import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Category } from '../database/entities/category.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsImportController } from './import.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductsService],
  controllers: [ProductsController, ProductsImportController],
  exports: [ProductsService],
})
export class ProductsModule {} 