import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto, SearchCategoryDto } from './dto/category.dto';
export declare class CategoryRepository extends Repository<Category> {
    fetch(searchCategoryDto: SearchCategoryDto): Promise<Category[]>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>;
}
