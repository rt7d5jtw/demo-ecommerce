import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  cname: string;
}

export class SearchCategoryDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
