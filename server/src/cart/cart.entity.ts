import { CartItem } from './cart-item.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('cart')
export class Cart extends BaseEntity {
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
    type: 'uuid'
  })
  user_id: string;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    type: 'date'
  })
  created_at: Date;

  @OneToMany(() => CartItem, (cart_item) => cart_item.cart, {
    onDelete: 'CASCADE'
  })
  cart_item: CartItem[];

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
    cascade: true
  })
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id'
    }
  ])
  user: User;
}
