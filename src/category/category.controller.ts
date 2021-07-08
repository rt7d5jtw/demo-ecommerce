import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  Patch,
  ValidationPipe,
  ParseUUIDPipe,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from './category.service';
import { CreateCategoryDto, SearchCategoryDto } from './dto/category.dto';
import { Category } from './category.entity';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategory(@Query(ValidationPipe) searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
    return this.categoryService.getCategory(searchCategoryDto);
  }

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch(':id')
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, createCategoryDto);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
