import { CategoryService } from './category.service';
import { CreateCategoryDto, SearchCategoryDto } from './dto/category.dto';
import { Category } from './category.entity';
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    fetch(searchCategoryDto: SearchCategoryDto): Promise<Category[]>;
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    update(id: string, createCategoryDto: CreateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
}
