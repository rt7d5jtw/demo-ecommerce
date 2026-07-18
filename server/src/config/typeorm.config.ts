import { CartItem } from '../cart/cart-item.entity';
import { Cart } from '../cart/cart.entity';
import { Category } from '../category/category.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../product/product.entity';
import { Promotion } from '../promotions/promotion.entity';
import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';

// New typeorm configuration.
// NestJS-TypeORM configuration at 'src/app.module.ts'
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
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
  synchronize: false,
  logging: true,
  subscribers: [],
  migrations: []
});
