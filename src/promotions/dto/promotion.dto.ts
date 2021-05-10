import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PromotionDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  url: string;
  image: string;
}

export type UpdatePromotionDto = Partial<PromotionDto>;
