import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { Product } from '../product/product.entity';
import { Cart } from './cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product]),
    MulterModule.register({
      dest: './images',
    }),
    PassportModule,
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
