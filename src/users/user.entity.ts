import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Cart } from '../cart/cart.entity';
import { Order } from '../orders/order.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email!: string;

  @Column({ length: 150 })
  password: string;

  @Column()
  role: UserRole;

  @Column()
  salt: string;

  @CreateDateColumn({ name: 'registered_at' })
  createdAt: Date;

  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;

  @OneToMany(() => Order, order => order.user, { eager: true })
  orders: Order[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
