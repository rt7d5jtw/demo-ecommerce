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

  async fetch(searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
    return this.categoryRepository.fetch(searchCategoryDto);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.createCategory(createCategoryDto);
  }

  async update(id: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { cname } = createCategoryDto;
    const category = await this.categoryRepository.findOne({ where: { id: id } });
    if (!category) {
      throw new NotFoundException(`No category found with "${id}"`);
    }

    category.cname = cname;

    if (cname.length === 0) {
      throw new NotFoundException('Missing argument or invalid argument');
    }
    await this.categoryRepository.save(category);

    return category;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.delete(id);

    if (category.affected === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}
