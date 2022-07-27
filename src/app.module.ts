import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { User } from './users/user.entity';
import { CartItem } from './cart/cart-item.entity';
import { Category } from './category/category.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { Product } from './product/product.entity';
import { Promotion } from './promotions/promotion.entity';
import { Cart } from './cart/cart.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist')
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '/.env' })],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASS'),
        database: configService.getOrThrow('DATABASE'),
        entities: [
          User,
          Cart,
          CartItem,
          Category,
          Order,
          OrderItem,
          Product,
          Promotion
        ],
        synchronize: false
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    ProductModule,
    CartModule,
    OrdersModule,
    AuthModule,
    CategoryModule,
    PromotionsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
