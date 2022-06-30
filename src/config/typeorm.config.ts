import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CartItem } from 'src/cart/cart-item.entity';
import { Cart } from 'src/cart/cart.entity';
import { Category } from 'src/category/category.entity';
import { OrderItem } from 'src/orders/order-item.entity';
import { Order } from 'src/orders/order.entity';
import { Product } from 'src/product/product.entity';
import { Promotion } from 'src/promotions/promotion.entity';
import { User } from 'src/users/user.entity';
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
  entities: [User, Promotion, Product, Order, OrderItem, Category, Cart, CartItem],
  synchronize: process.env.DB_SYNC ? parseBool(process.env.DB_SYNC) : false,
};

// new typeorm configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER ? process.env.DB_USER : 'postgres',
  password: process.env.DB_PASS ? process.env.DB_PASS : 'postgres',
  database: process.env.DATABASE ? process.env.DATABASE : 'bookstore',
  entities: [User, Promotion, Product, Order, OrderItem, Category, Cart, CartItem],
  synchronize: process.env.DB_SYNC ? parseBool(process.env.DB_SYNC) : false,
  logging: true,
});
