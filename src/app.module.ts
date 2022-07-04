import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist')
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
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
