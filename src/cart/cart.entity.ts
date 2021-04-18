import { CartItem } from './cart-item.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from '../users/user.entity';

@Entity('cart')
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'uuid' })
  userId: string | null;

  @CreateDateColumn()
  CreatedAt: Date;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  cartItems: CartItem[];

  @OneToOne(() => User, user => user.cart, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

}
