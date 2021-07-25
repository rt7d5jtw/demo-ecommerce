import { BadRequestException, Logger } from '@nestjs/common';
import { Category } from 'src/category/category.entity';
import { EntityRepository, getConnection, getRepository, Repository } from 'typeorm';
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

  async createProduct(createProductDto: CreateProductDto): Promise<any> {
    const { title, image, price, description, categoryIds } = createProductDto;

    if (categoryIds.length === 0 || !Array.isArray(categoryIds)) {
      throw new BadRequestException('Input needs to be an array!');
    }

    const ids = categoryIds.map(({ id }) => id);
    const categories = await getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id IN (:...ids)', {
        ids: ids,
      })
      .getMany();

    const product = this.create();
    product.title = title;
    product.image = image;
    product.price = price;
    product.description = description;
    product.status = ProductStatus.IN_STOCK;
    product.categories = categories;

    try {
      await this.save(product);
    } catch (error) {
      this.logger.error(`Failed to create a product`, error.stack);
    }

    return product;
  }
}
