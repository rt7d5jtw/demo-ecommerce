import { Category } from './category.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCategoryDto, SearchCategoryDto } from './dto/category.dto';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async fetch(searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
    const { search } = searchCategoryDto;
    const query = this.createQueryBuilder('category');

    if (search) {
      query.where('category.cname LIKE :search', { search: `%${search}%` });
    }

    const categories = await query.getMany();
    return categories;
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
}
