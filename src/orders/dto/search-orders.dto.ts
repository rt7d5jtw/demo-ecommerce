import { IsIn, IsOptional, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class SearchOrdersDto {
  @IsOptional()
  @IsIn([OrderStatus.PROCESSING, OrderStatus.SHIPPED])
  status: OrderStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
