import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { SearchCategoryDto, CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async fetch(searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
    const query = this.categoryRepository.createQueryBuilder('category');

    if (searchCategoryDto.search) {
      query.where('category.cname LIKE :search', {
        search: `%${searchCategoryDto.search}%`
      });
    }

    const categories = await query.getMany();

    return categories;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { cname } = createCategoryDto;
    const category = new Category();
    category.cname = cname;
    if (cname.length === 0) {
      throw new NotFoundException('Missing argument or invalid argument');
    }
    await category.save();

    return category;
  }

  async update(
    id: string,
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const { cname } = createCategoryDto;
    const category = await this.categoryRepository.findOne({
      where: { id: id }
    });
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
