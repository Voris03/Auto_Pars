import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: false })
  isEmailVerified: boolean = false;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ nullable: true })
  resetPasswordExpires?: Date;

  @Column({ default: false })
  isAdmin: boolean = false;

  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  @OneToMany(() => Cart, cart => cart.user)
  cart!: Cart[];

  @ManyToMany(() => Product)
  @JoinTable()
  parts!: Product[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}