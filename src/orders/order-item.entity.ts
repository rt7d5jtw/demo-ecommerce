import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';

@Entity('order-item')
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  orderId: string;

  @Column({ type: 'float' })
  price: number

  @Column()
  quantity: number;

  @ManyToOne(() => Order, order => order.orderitems)
  order: Order;

  @ManyToOne(() => Product, product => product.orderItem)
  product: Product[]

}
