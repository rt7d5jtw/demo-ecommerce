import { IsUrl, IsString, IsNotEmpty } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;
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

export type UpdateProductDto = Partial<CreateProductDto>
