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

  async getProducts(searchProductDto: SearchProductDto): Promise<Product[]> {
    this.logger.verbose(`Retrieving all products`);
    return this.productRepository.getProducts(searchProductDto);
  }

  async getProductById(id: number): Promise<Product> {
    const result = await this.productRepository.findOne(id);
    if (!result) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return result;
  }

  createProduct(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.verbose(`Creating a new product`);
    return this.productRepository.createProduct(createProductDto);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { title, image, price, description, author } = updateProductDto;
    const product = await this.getProductById(id);

    product.title = title;
    product.image = image;
    product.price = price;
    product.author = author;
    product.description = description;
    await product.save();

    return product;
  }

  async updateStatus(id: number, status: ProductStatus): Promise<Product> {
    const product = await this.getProductById(id);
    product.status = status;
    await product.save();

    return product;
  }

  async deleteProductById(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
