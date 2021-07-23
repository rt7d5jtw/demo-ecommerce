import { IsNotEmpty, IsString } from 'class-validator';

export class PromotionDto {
  image: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  url: string;
}

export type UpdatePromotionDto = Partial<PromotionDto>;
