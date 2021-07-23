import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Product, ProductStatus } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  private logger = new Logger('ProductRepository');

  async fetch(searchProductDto: SearchProductDto): Promise<Product[]> {
    const { search, cat } = searchProductDto;
    const query = this.createQueryBuilder('product');

    if (search) {
      query.andWhere('product.title LIKE :search OR product.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (cat) {
      query.andWhere('product.categoryId = :cat', { cat: `${cat}` });
    }

    const products = await query.getMany();
    return products;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { title, image, price, description, category } = createProductDto;

    const product = this.create();
    product.title = title;
    product.image = image;
    product.price = price;
    product.description = description;
    product.status = ProductStatus.IN_STOCK;
    product.categoryId = category;

    try {
      await product.save();
    } catch (error) {
      this.logger.error(`Failed to create a product`, error.stack);
    }

    return product;
  }
}
