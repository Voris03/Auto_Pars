import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column()
  brand!: string;

  @Column()
  sku!: string;

  @Column('int')
  stock!: number;

  @Column('simple-array', { nullable: true })
  images: string[] = [];

  @Column('simple-json', { nullable: true })
  specifications: Record<string, any> = {};

  @ManyToOne(() => Category, (category) => category.products)
  category!: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];

  @Column({ default: 0 })
  popularity: number = 0;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
