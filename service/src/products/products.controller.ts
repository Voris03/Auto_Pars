import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ProductsService,
  ProductFilters,
  ProductSort,
} from './products.service';
import { Product } from '../database/entities/product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit of items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Product category filter',
    type: String,
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    description: 'Brand filter',
    type: String,
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Minimum price filter',
    type: Number,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price filter',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for products',
    type: String,
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    description: 'Field to sort the products by',
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Order to sort the products (ASC/DESC)',
    enum: ['ASC', 'DESC'],
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters: ProductFilters = {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
    };

    const sort: ProductSort | undefined = sortField
      ? { field: sortField as any, order: sortOrder || 'ASC' }
      : undefined;

    return this.productsService.findAll(page, limit, filters, sort);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({
    description: 'Create a new product',
    type: Product, // Указываем класс сущности Product
  })
  async create(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.create(productData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() productData: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, productData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }

  @Get('categories/all')
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get('brands/all')
  async getBrands() {
    return this.productsService.getBrands();
  }
}
