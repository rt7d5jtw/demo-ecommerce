import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { CartItem } from '../cart/cart-item.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Category } from '../category/category.entity';

export enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column('float')
  price: number;

  @Column()
  description: string;

  @Column()
  status: ProductStatus;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @OneToMany(() => CartItem, (cartitem) => cartitem.product)
  cartItem: CartItem[];

  @OneToMany(() => OrderItem, (orderitem) => orderitem.product)
  orderItem: OrderItem[];

  @ManyToMany(() => Category, {
    cascade: true
  })
  @JoinTable({
    name: 'product_categories',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'id'
    }
  })
  categories: Category[];
}
