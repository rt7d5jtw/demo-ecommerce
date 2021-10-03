import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { ProductRepository } from './product.repository';
export declare class ProductService {
    private productRepository;
    private logger;
    constructor(productRepository: ProductRepository);
    fetch(searchProductDto: SearchProductDto): Promise<Product[]>;
    fetchById(id: number): Promise<Product>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
