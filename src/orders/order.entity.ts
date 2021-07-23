import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
}

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'float' })
  total_price: number;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  postalcode: string;

  @Column()
  status: OrderStatus;

  @CreateDateColumn({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    eager: false,
  })
  user: User;

  @OneToMany(() => OrderItem, (orderitem) => orderitem.order)
  orderitems: OrderItem[];
}
