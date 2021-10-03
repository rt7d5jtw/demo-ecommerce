import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { SearchCategoryDto, CreateCategoryDto } from './dto/category.dto';
export declare class CategoryService {
    private categoryRepository;
    constructor(categoryRepository: CategoryRepository);
    fetch(searchCategoryDto: SearchCategoryDto): Promise<Category[]>;
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    update(id: string, createCategoryDto: CreateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
}
