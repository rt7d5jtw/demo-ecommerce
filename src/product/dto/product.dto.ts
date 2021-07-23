import { IsUrl, IsString, IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNumberString()
  price: number;
  @IsUrl()
  image?: string;
  @IsString()
  description?: string;
  @IsString()
  @IsUUID()
  category: string;
}

export interface IUpdateProduct extends CreateProductDto {
  status: ProductStatus;
}

export type UpdateProductDto = Partial<IUpdateProduct>;
