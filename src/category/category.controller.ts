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
  fetch(@Query(ValidationPipe) searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
    return this.categoryService.fetch(searchCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return this.categoryService.update(id, createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
