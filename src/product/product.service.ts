import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { ProductRepository } from './product.repository';
import { Logger } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { Category } from '../category/category.entity';

@Injectable()
export class ProductService {
  private logger = new Logger('ProductController');
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async fetch(searchProductDto: SearchProductDto): Promise<Product[]> {
    this.logger.verbose(`Retrieving all products`);
    return ProductRepository.fetch(searchProductDto);
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
    return ProductRepository.createProduct(createProductDto);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    return ProductRepository.updateProduct(id, updateProductDto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
