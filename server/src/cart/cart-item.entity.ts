import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  JoinColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';

@Entity('cart_item')
export class CartItem extends BaseEntity {
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
    name: 'cart_id',
    nullable: false,
    type: 'uuid'
  })
  cart_id: string;

  @Column({
    name: 'product_id',
    nullable: false,
    type: 'int'
  })
  product_id: number;

  @Column({
    name: 'quantity',
    nullable: false,
    type: 'int'
  })
  quantity: number;

  @Column({
    name: 'price',
    nullable: false,
    type: 'double precision'
  })
  price: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'date'
  })
  created_at: Date;

  @ManyToOne(() => Cart, (cart) => cart.cart_item, {
    onDelete: 'CASCADE'
  })
  @JoinColumn([
    {
      name: 'cart_id',
      referencedColumnName: 'id'
    }
  ])
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cart_item)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id'
  })
  product: Product[];
}
