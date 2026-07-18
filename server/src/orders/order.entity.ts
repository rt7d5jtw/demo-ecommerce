import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  PAID = 'PAID'
}

@Entity('orders')
export class Order extends BaseEntity {
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
    name: 'user_id',
    unique: true,
    nullable: false,
    type: 'uuid'
  })
  user_id: string;

  @Column({
    name: 'total_price',
    nullable: false,
    type: 'double precision'
  })
  total_price: number;

  @Column({
    name: 'address',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  address: string;

  @Column({
    name: 'country',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  country: string;

  @Column({
    name: 'city',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  city: string;

  @Column({
    name: 'postalcode',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  postalcode: string;

  @Column({
    name: 'status',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  status: OrderStatus;

  @CreateDateColumn({
    name: 'date',
    nullable: false,
    type: 'date'
  })
  date: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    eager: false
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
  user: User;

  // OrderItem references the Class itself (OrderItem)
  @OneToMany(() => OrderItem, (order_item) => order_item.order)
  order_item: OrderItem[];
}
