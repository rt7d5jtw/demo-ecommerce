import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class SearchProductDto {
  @IsOptional()
  @IsIn([ProductStatus.IN_STOCK, ProductStatus.OUT_OF_STOCK])
  status?: ProductStatus;

  @IsOptional()
  @IsNotEmpty()
  cat?: string;

  @IsOptional()
  @IsNotEmpty()
  search?: string;
}
