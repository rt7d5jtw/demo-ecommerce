import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';

@Entity('cart-item')
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string | Promise<string>;

  @Column({ type: 'uuid' })
  cartId: string | null;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column('float')
  price: number;

  @CreateDateColumn({ type: 'date' })
  CreatedAt: Date;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'cartId', referencedColumnName: 'id' }])
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItem)
  product: Product[];
}
