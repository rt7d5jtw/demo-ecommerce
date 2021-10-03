import { Product } from '../product/product.entity';
import { BaseEntity } from 'typeorm';
export declare class Category extends BaseEntity {
    id: string;
    cname: string;
    products: Product[];
}
