import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CartItem } from '../cart/cart-item.entity';
import { Cart } from '../cart/cart.entity';
import { Category } from '../category/category.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../product/product.entity';
import { Promotion } from '../promotions/promotion.entity';
import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';

function parseBool(str: string): boolean {
  return str === 'true' ? true : str === 'false' ? false : false;
}

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER ? process.env.DB_USER : 'postgres',
  password: process.env.DB_PASS ? process.env.DB_PASS : 'postgres',
  database: process.env.DATABASE ? process.env.DATABASE : 'bookstore',
  entities: [
    User,
    CartItem,
    Cart,
    Category,
    Order,
    OrderItem,
    Product,
    Promotion
  ],
  synchronize: process.env.DB_SYNC ? parseBool(process.env.DB_SYNC) : false
};

// new typeorm configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER ? process.env.DB_USER : 'postgres',
  password: process.env.DB_PASS ? process.env.DB_PASS : 'postgres',
  database: process.env.DATABASE ? process.env.DATABASE : 'bookstore',
  entities: [
    User,
    CartItem,
    Cart,
    Category,
    Order,
    OrderItem,
    Product,
    Promotion
  ],
  synchronize: process.env.DB_SYNC ? parseBool(process.env.DB_SYNC) : false,
  logging: true,
  subscribers: [],
  migrations: []
});
