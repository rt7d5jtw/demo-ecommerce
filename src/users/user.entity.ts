import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cart } from '../cart/cart.entity';
import { Order } from '../orders/order.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

@Entity('users')
export class User extends BaseEntity {
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
    name: 'email',
    nullable: false,
    length: 254,
    type: 'varchar'
  })
  email!: string;

  @Column({ name: 'password', nullable: false, length: 255, type: 'varchar' })
  password: string;

  @Column({ name: 'role', nullable: false, length: 10, type: 'varchar' })
  role: UserRole;

  @Column({ name: 'salt', nullable: false, length: 64, type: 'varchar' })
  salt: string;

  @CreateDateColumn({ name: 'registered_at', nullable: false, type: 'date' })
  registered_at: Date;

  //@OneToOne(() => Cart, (cart) => cart.user, {
  //  onDelete: 'CASCADE'
  //})
  //@JoinColumn({
  //  referencedColumnName: 'id'
  //})
  //cart: Cart;

  @OneToMany(() => Order, (order) => order.user, { eager: true })
  @JoinColumn({
    referencedColumnName: 'id'
  })
  orders: Order[];

  public async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
