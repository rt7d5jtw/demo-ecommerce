import { IsUrl, IsString, IsNotEmpty, IsNumberString } from 'class-validator';
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
  categoryIds: CategoryIdDto[];
}

type CategoryIdDto = {
  id: string;
};

export interface IUpdateProduct extends CreateProductDto {
  status: ProductStatus;
}

export type UpdateProductDto = Partial<IUpdateProduct>;
