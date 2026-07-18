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
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  @Column({
    unique: true,
    name: 'id',
    primary: true,
    nullable: false
  })
  id: number;

  @Column({
    name: 'title',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  title: string;

  @Column({
    name: 'image',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  image: string;

  @Column({
    name: 'price',
    nullable: false,
    type: 'double precision'
  })
  price: number;

  @Column({
    name: 'description',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  description: string;

  @Column({
    name: 'status',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  status: ProductStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'date',
    nullable: false
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'date'
  })
  updated_at: Date;

  @OneToMany(() => CartItem, (cartitem) => cartitem.product)
  cart_item: CartItem[];

  @OneToMany(() => OrderItem, (orderitem) => orderitem.product)
  order_item: OrderItem[];

  @ManyToMany(() => Category, {
    cascade: true
  })
  @JoinTable({
    name: 'product_categories',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id'
    }
  })
  categories: Category[];
}
