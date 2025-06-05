import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { Category } from '../database/entities/category.entity';

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;

  model?: string;
  year?: string;
  engine?: string;
  body?: string;
  modification?: string;
}

export interface ProductSort {
  field: 'price' | 'popularity' | 'createdAt';
  order: 'ASC' | 'DESC';
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(
    page: string | number = 1,
    limit: string | number = 10,
    filters?: ProductFilters,
    sort?: ProductSort,
  ) {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (isNaN(pageNum) || isNaN(limitNum)) {
      throw new Error('Параметры пагинации должны быть числами');
    }

    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // 🔍 Фильтры по полям продукта
    if (filters) {
      if (filters.category) {
        qb.andWhere('category.id = :categoryId', {
          categoryId: filters.category,
        });
      }

      if (filters.brand) {
        qb.andWhere('product.brand = :brand', { brand: filters.brand });
      }

      if (filters.minPrice !== undefined) {
        qb.andWhere('product.price >= :minPrice', {
          minPrice: filters.minPrice,
        });
      }

      if (filters.maxPrice !== undefined) {
        qb.andWhere('product.price <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }

      if (filters.search) {
        qb.andWhere(
          '(product.name ILIKE :search OR product.description ILIKE :search)',
          { search: `%${filters.search}%` },
        );
      }

      // 🔍 Фильтры по specifications (JSON поля)
      if (filters.model) {
        qb.andWhere(`product.specifications ->> 'model' = :model`, {
          model: filters.model,
        });
      }

      if (filters.year) {
        qb.andWhere(`product.specifications ->> 'year' = :year`, {
          year: filters.year,
        });
      }

      if (filters.engine) {
        qb.andWhere(`product.specifications ->> 'engine' = :engine`, {
          engine: filters.engine,
        });
      }

      if (filters.body) {
        qb.andWhere(`product.specifications ->> 'body' = :body`, {
          body: filters.body,
        });
      }

      if (filters.modification) {
        qb.andWhere(
          `product.specifications ->> 'modification' = :modification`,
          {
            modification: filters.modification,
          },
        );
      }
    }

    // 📦 Сортировка
    if (sort) {
      qb.orderBy(`product.${sort.field}`, sort.order);
    } else {
      qb.orderBy('product.createdAt', 'DESC');
    }

    // 📄 Пагинация
    const skip = (pageNum - 1) * limitNum;
    qb.skip(skip).take(limitNum);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findOneById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Продукт с id=${id} не найден`);
    }

    return product;
  }

  async findOne(id: string): Promise<Product> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new NotFoundException('Некорректный ID товара');
    }

    return this.findOneById(numericId);
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
    const rows = await this.productsRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.brand', 'brand')
      .getRawMany();

    return rows.map((r) => r.brand).filter(Boolean);
  }

  async createFromImport(data: {
    name: string;
    description: string;
    brand: string;
    price: number;
    image?: string;
    categoryName: string;
  }): Promise<Product> {
    let category = await this.categoriesRepository.findOne({
      where: { name: data.categoryName },
    });

    if (!category) {
      category = this.categoriesRepository.create({ name: data.categoryName });
      await this.categoriesRepository.save(category);
    }

    const product = this.productsRepository.create({
      name: data.name,
      description: data.description,
      brand: data.brand,
      price: data.price,
      sku: Date.now().toString(),
      stock: 10,
      images: data.image ? [data.image] : [],
      specifications: {},
      category,
    });

    return this.productsRepository.save(product);
  }
}
