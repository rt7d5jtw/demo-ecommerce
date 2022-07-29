import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Logger } from '@nestjs/common';
import { Repository, TypeORMError } from 'typeorm';
import { Category } from '../category/category.entity';

@Injectable()
export class ProductService {
  private logger = new Logger('ProductController');
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  /**
   * Calls productRepository.createQueryBuilder to query for product by the specified parameters, or just returns all products.
   * @param {SearchProductDto} searchProductDto - Search parameters to search for specific Product(s).
   * @returns {Product[]} Products that were found.
   */
  async fetch(searchProductDto: SearchProductDto): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
    query.select('product');
    query.leftJoinAndSelect('product.categories', 'category');

    if (searchProductDto.search) {
      query.andWhere(
        'LOWER(product.title) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search)',
        {
          search: `%${searchProductDto.search}%`
        }
      );
    }

    const products = await query.getMany();
    return products;
  }

  /**
   * Calls productRepository.find to search for Product by the ID specified in the parameter.
   * @param {number} id - ID of the Product to be returned
   * @returns {Promise<Product>} Product that was returned by {@link productRepository.find}
   */
  async fetchById(id: number): Promise<Product> {
    const [result] = await this.productRepository.find({
      relations: ['categories'],
      where: { id: id }
    });

    if (!result)
      throw new NotFoundException(`Product with ID "${id}" not found`);

    return result;
  }

  /**
   * Utilizes categoryRepository to assign the categories for the created Product
   * @param {CreateProductDto} createProductDto - Inputs for the Product to be created.
   * @returns {Promise<Product>} The {@link Product} created from the inputs.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { title, image, price, description, categoryIds } = createProductDto;

    if (categoryIds.length === 0 || !Array.isArray(categoryIds))
      throw new BadRequestException('Input needs to be an array!');

    /* Searches for the categories with the specified ids
     * from the parameters of CreateProductDto */
    const ids = categoryIds.map(({ id }) => id);
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id IN (:...ids)', {
        ids: ids
      })
      .getMany();

    const product = this.productRepository.create();
    product.title = title;
    product.image = image;
    product.price = price;
    product.description = description;
    product.status = ProductStatus.IN_STOCK;
    product.categories = categories;
    product.created_at = new Date();

    try {
      await this.productRepository.save(product);
    } catch (error) {
      this.logger.error(`Failed to create a product`, error.stack);
    }

    return product;
  }

  /**
   * Utilizes categoryRepository to assign the categories for the updated {@link Product}.
   * @param {UpdateProductDto} updateProductDto - Inputs for the Product to be updated.
   * @returns {Promise<Product>} The {@link Product} updated from the inputs.
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const { title, image, price, description, status, categoryIds } =
      updateProductDto;
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
      categories = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.id IN (:...ids)', {
          ids: ids
        })
        .getMany();
    }

    product.title = title ?? product.title;
    product.image = image ?? product.image;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.status = status ?? product.status;
    product.categories = categories ?? product.categories;
    product.updated_at = new Date();

    try {
      await this.productRepository.save(product);
    } catch (err) {
      throw new TypeORMError('Failed to update the product');
    }

    return product;
  }

  /**
   * Removes product by calling productRepository.delete which takes the id from the parameter.
   * @param {number} id - ID of the Product to be removed.
   * @returns {Promise<void>}
   */
  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
