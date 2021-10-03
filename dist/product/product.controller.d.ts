import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    fetch(searchProductDto: SearchProductDto): Promise<Product[]>;
    fetchById(id: number): Promise<Product>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
