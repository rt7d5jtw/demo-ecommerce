import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { SearchCategoryDto, CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository
  ) {}

  async getCategory(searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
    return this.categoryRepository.getCategory(searchCategoryDto);
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { cname } = createCategoryDto;
    const category = new Category();
    category.cname = cname;
    if (cname.length === 0) {
      throw new NotFoundException('Missing argument or invalid argument');
    }
    await category.save();

    return category;
  }

  async updateCategory(id: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { cname } = createCategoryDto;
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`No category found with "${id}"`);
    }

    category.cname = cname;

    if (cname.length === 0) {
      throw new NotFoundException('Missing argument or invalid argument');
    }
    await category.save();

    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.delete(id);

    if (category.affected === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}
