import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product, ProductStatus } from './product.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../category/category.entity';
import { arrayOfProducts, arrayOfCategories } from '../../test/testdata.json';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;
  let categoryRepository: Repository<Category>;

  const mockCategoryRepository = () => ({
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(arrayOfCategories)
    })
  });

  const mockProductRepository = () => ({
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(arrayOfProducts)
    }),
    find: jest.fn().mockResolvedValue([
      {
        id: 10,
        categories: [
          { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
          {
            id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
            cname: 'Milk Chocolate'
          }
        ],
        title: 'Dune',
        image: 'https://i.imgur.com/Hiw0N.jpg',
        price: 12,
        description: 'nice boek',
        status: 'IN_STOCK',
        createdAt: '2021-07-02',
        updatedAt: '2021-07-02'
      }
    ]),
    findOne: jest.fn().mockResolvedValue({
      id: 10,
      categories: [
        { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
        { id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa', cname: 'Milk Chocolate' }
      ],
      title: 'Dune',
      image: 'https://i.imgur.com/Hiw0N.jpg',
      price: 12,
      description: 'nice boek',
      status: 'IN_STOCK',
      createdAt: '2021-07-02',
      updatedAt: '2021-07-02'
    }),
    create: jest.fn(),
    delete: jest.fn(),
    save: jest.fn()
  });

  const stuff = {
    id: 10,
    categories: [
      { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
      { id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa', cname: 'Milk Chocolate' }
    ],
    title: 'Dune',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    price: 12,
    description: 'nice boek',
    status: 'IN_STOCK',
    createdAt: '2021-07-02',
    updatedAt: '2021-07-02'
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository
        },
        {
          provide: getRepositoryToken(Category),
          useFactory: mockCategoryRepository
        }
      ]
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it('calls fetch in userRepository and returns product array', async () => {
      const products = await productService.fetch({
        status: ProductStatus.IN_STOCK
      });
      expect(products).toEqual(arrayOfProducts);
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
      expect(productRepository.createQueryBuilder().select).toHaveBeenCalled();
      expect(
        productRepository.createQueryBuilder().leftJoinAndSelect
      ).toHaveBeenCalled();
      expect(productRepository.createQueryBuilder().getMany).toHaveBeenCalled();
    });
  });

  describe('fetchById', () => {
    it('calls findOne in userRepository, if product is found, returns a product', async () => {
      await expect(productService.fetchById(10)).resolves.toEqual({
        id: 10,
        categories: expect.any(Array),
        title: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        description: expect.any(String),
        status: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
      expect(productRepository.find).toHaveBeenCalledWith({
        relations: ['categories'],
        where: { id: 10 }
      });
    });
  });

  describe('create', () => {
    it('calls createProduct in ProductRepository and returns the new product', async () => {
      const dto = {
        title: 'i like chocolate',
        image: 'chocolate.jpg',
        price: 9.5,
        description: 'i like chocolate',
        categoryIds: [
          { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0' },
          { id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa' }
        ]
      };
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation(() => new Product());

      expect(await productService.create(dto)).toMatchObject({
        status: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        categories: expect.any(Array)
      });
      expect(categoryRepository.createQueryBuilder).toHaveBeenCalled();
      expect(productRepository.create).toHaveBeenCalled();
      expect(productRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('calls fetchById in the productService to fetch the product and then calls the new updated parameters to replace the existing product attributes', async () => {
      /* Execution: 1. productService.fetchById
       *            2. categoryRepository.createQueryBuilder.where.getMany
       *            3. productRepository.save
       *            4. Returns Product
       */
      jest
        .spyOn(productService, 'fetchById')
        .mockResolvedValue(arrayOfProducts[0] as unknown as Product);
      jest
        .spyOn(categoryRepository, 'createQueryBuilder')
        .mockImplementation(() => arrayOfCategories as any);
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation(() => arrayOfProducts[0] as unknown as Product);
      const dto = {
        title: 'chocolate'
      };
      const updatedProduct = await productService.update(10, dto);
      expect(updatedProduct).toMatchObject({
        title: 'chocolate',
        image: expect.any(String),
        price: expect.any(Number),
        description: expect.any(String),
        categories: expect.any(Array)
      });
      expect(productService.fetchById).toHaveBeenCalledWith(10);
      //expect(categoryRepository.createQueryBuilder).toHaveBeenCalled();
      expect(productRepository.save).toHaveBeenCalledWith(updatedProduct);
    });

    it('throws an error for giving missing id', async () => {
      const dto = { title: 'chocolate' };
      jest.spyOn(productRepository, 'find').mockResolvedValue(undefined);
      await expect(productService.update(11, dto)).rejects.toThrow();
      expect(productRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('calls delete in productRepository to delete the product', async () => {
      expect.assertions(2);
      jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: '' });
      await expect(productService.remove(10)).resolves.not.toThrow();
      expect(productRepository.delete).toHaveBeenCalledWith(10);
    });

    it('throws an error for getting missing id', async () => {
      expect.assertions(2);
      jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: '' });
      await expect(() => productService.remove(10)).rejects.toThrow(
        NotFoundException
      );
      expect(productRepository.delete).toHaveBeenCalledWith(10);
    });
  });
});
