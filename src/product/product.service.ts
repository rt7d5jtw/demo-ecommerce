import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { ProductRepository } from './product.repository';
import { Logger } from '@nestjs/common';

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
    const result = await this.productRepository.findOne(id);
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
    const { title, image, price, description, author, status } = updateProductDto;
    const product = await this.fetchById(id);

    product.title = title;
    product.image = image;
    product.price = price;
    product.author = author;
    product.description = description;
    product.status = status;
    await this.productRepository.save(product);

    return product;
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
