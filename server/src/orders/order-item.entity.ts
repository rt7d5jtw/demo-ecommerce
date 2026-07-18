import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';

@Entity('order_item')
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Column({
    unique: true,
    name: 'id',
    primary: true,
    nullable: false,
    type: 'uuid'
  })
  id: string;

  @Column({
    unique: true,
    name: 'order_id',
    nullable: false,
    type: 'uuid'
  })
  order_id: string;

  @Column({
    name: 'price',
    nullable: false,
    type: 'double precision'
  })
  price: number;

  @Column({
    name: 'quantity',
    nullable: false,
    type: 'int'
  })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.order_item)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id'
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.order_item)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id'
  })
  product: Product[];
}
