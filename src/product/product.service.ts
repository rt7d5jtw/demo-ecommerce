import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { ProductRepository } from './product.repository';
import { Logger } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { Category } from '../category/category.entity';

@Injectable()
export class ProductService {
  private logger = new Logger('ProductController');
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository
  ) {}

  async fetch(searchProductDto: SearchProductDto): Promise<Product[]> {
    this.logger.verbose(`Retrieving all products`);
    return this.productRepository.fetch(searchProductDto);
  }

  async fetchById(id: number): Promise<Product> {
    const [result] = await this.productRepository.find({
      relations: ['categories'],
      where: { id: id },
    });
    if (!result) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return result;
  }

  create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.verbose(`Creating a new product`);
    return this.productRepository.createProduct(createProductDto);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { title, image, price, description, status, categoryIds } = updateProductDto;
    const product = await this.fetchById(id);

    if (
      updateProductDto &&
      Object.keys(updateProductDto).length === 0 &&
      updateProductDto.constructor === Object
    ) {
      throw new BadRequestException('Make sure correct inputs are provided');
    }

    let categories: any;
    let ids = null;
    if (categoryIds && categoryIds.length !== 0 && Array.isArray(categoryIds)) {
      ids = categoryIds.map(({ id }) => id);
      categories = await getRepository(Category)
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
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
