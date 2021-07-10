import { IsUrl, IsCurrency, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsCurrency()
  price: number;
  @IsUrl()
  image?: string;
  @IsString()
  author: string;
  @IsString()
  description?: string;
  @IsString()
  category: string;
}

export interface IUpdateProduct extends CreateProductDto {
  status: ProductStatus;
}

export type UpdateProductDto = Partial<IUpdateProduct>;
