import { Category } from './category.entity';
import { EntityRepository, Repository } from 'typeorm';
import { SearchCategoryDto } from './dto/category.dto';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getCategory(searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
    const { search } = searchCategoryDto;
    const query = this.createQueryBuilder('category');

    if (search) {
      query.where('category.cname LIKE :search', { search: `%${search}%` });
    }

    const categories = await query.getMany();
    return categories;
  }
}
