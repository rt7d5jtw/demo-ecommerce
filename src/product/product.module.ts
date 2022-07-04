import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Product } from './product.entity';
import { Category } from 'src/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    PassportModule,
    AuthModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
