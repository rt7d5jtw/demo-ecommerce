import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Product } from './product.entity';
export declare class ProductRepository extends Repository<Product> {
    private logger;
    fetch(searchProductDto: SearchProductDto): Promise<Product[]>;
    createProduct(createProductDto: CreateProductDto): Promise<any>;
}
