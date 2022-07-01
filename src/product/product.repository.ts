import { BadRequestException } from '@nestjs/common';
import { Category } from '../category/category.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Product, ProductStatus } from './product.entity';
import { AppDataSource } from '../config/typeorm.config';

interface ProductRepositoryExtended {
  fetch: (arg0: SearchProductDto) => Promise<Product[]>;
  createProduct: (arg0: CreateProductDto) => Promise<any>;
  updateProduct: (arg0: number, arg1: UpdateProductDto) => Promise<Product>;
}

const ProductRepository: Repository<Product> & ProductRepositoryExtended =
  AppDataSource.getRepository(Product).extend({
    async fetch(searchProductDto: SearchProductDto): Promise<Product[]> {
      const query = this.createQueryBuilder('product');
      query.select('product');
      query.leftJoinAndSelect('product.categories', 'category');

      if (searchProductDto.search) {
        query.andWhere(
          'LOWER(product.title) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search)',
          {
            search: `%${searchProductDto.search}%`,
          }
        );
      }

      const products = await query.getMany();
      return products;
    },

    async createProduct(createProductDto: CreateProductDto): Promise<any> {
      const { title, image, price, description, categoryIds } = createProductDto;

      if (categoryIds.length === 0 || !Array.isArray(categoryIds)) {
        throw new BadRequestException('Input needs to be an array!');
      }

      const ids = categoryIds.map(({ id }) => id);
      const categories = await AppDataSource.getRepository(Category)
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
        await product.save();
      } catch (error) {
        this.logger.error(`Failed to create a product`, error.stack);
      }

      return product;
    },

    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
      const { title, image, price, description, status, categoryIds } = updateProductDto;
      const product = await this.fetchById(id);

      // Validation
      if (
        updateProductDto &&
        Object.keys(updateProductDto).length === 0 &&
        updateProductDto.constructor === Object
      ) {
        throw new BadRequestException('Make sure correct inputs are provided');
      }

      let categories: any;
      let ids = null;

      // Validation + CategoryRepository transactions
      if (categoryIds && categoryIds.length !== 0 && Array.isArray(categoryIds)) {
        ids = categoryIds.map(({ id }) => id);
        categories = await AppDataSource.getRepository(Category)
          .createQueryBuilder('category')
          .where('category.id IN (:...ids)', {
            ids: ids,
          })
          .getMany();
      }

      product.title = title;
      product.image = image;
      product.price = price;
      product.description = description;
      product.status = status;
      product.categories = categories;

      try {
        await this.productRepository.save(product);
      } catch (err) {
        throw new Error('Failed to update the product');
      }
      return product;
    },
  });

export { ProductRepository, ProductRepositoryExtended };
