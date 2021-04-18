import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
}

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  total_price: number;

  @Column()
  address: string;

  @Column()
  status: OrderStatus;

  @CreateDateColumn({ name: 'Order_Date' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.orders, {
    eager: false
  })
  user: User;

  @OneToMany(() => OrderItem, orderitem => orderitem.order)
  orderitems: OrderItem[];
}
