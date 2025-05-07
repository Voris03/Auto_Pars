import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { Category } from '../database/entities/category.entity';

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductSort {
  field: 'price' | 'popularity' | 'createdAt';
  order: 'ASC' | 'DESC';
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: ProductFilters,
    sort?: ProductSort,
  ) {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category');

    // Apply filters
    if (filters) {
      if (filters.category) {
        queryBuilder.andWhere('category.id = :categoryId', {
          categoryId: filters.category,
        });
      }
      if (filters.brand) {
        queryBuilder.andWhere('products.brand = :brand', {
          brand: filters.brand,
        });
      }
      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('products.price >= :minPrice', {
          minPrice: filters.minPrice,
        });
      }
      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('products.price <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }
      if (filters.search) {
        queryBuilder.andWhere(
          '(products.name ILIKE :search OR products.description ILIKE :search)',
          { search: `%${filters.search}%` },
        );
      }
    }

    // Apply sorting
    if (sort) {
      queryBuilder.orderBy(`products.${sort.field}`, sort.order);
    } else {
      queryBuilder.orderBy('products.createdAt', 'DESC');
    }

    // Apply pagination
    const skip = (page - 1) * limit || 0;
    queryBuilder.skip(skip).take(limit || 10);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, productData);
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getBrands(): Promise<string[]> {
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.brand')
      .getRawMany();
    return products.map((p) => p.brand);
  }
}
