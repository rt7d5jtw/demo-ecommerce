import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { productArr } from './product.controller.spec';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

const mockProductRepository = () => ({
  fetch: jest.fn().mockResolvedValue(productArr),
  findOne: jest.fn().mockResolvedValue({
    id: 10,
    categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
    title: 'Dune',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    price: 12,
    description: 'nice boek',
    status: 'IN_STOCK',
    createdAt: '2021-07-02',
    updatedAt: '2021-07-02',
  }),
  createProduct: jest.fn().mockResolvedValue({
    id: 16,
    title: 'ice cream',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    price: 9.5,
    description: 'i like ice cream',
    categoryId: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
    status: 'IN_STOCK',
    createdAt: '2021-07-02',
    updatedAt: '2021-07-10',
  }),
  delete: jest.fn(),
  save: jest.fn(),
});

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useFactory: mockProductRepository },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it('calls fetch in userRepository and returns product array', async () => {
      expect.assertions(2);
      const products = await productService.fetch(undefined);
      expect(products).toEqual(productArr);
      expect(productRepository.fetch).toHaveBeenCalled();
    });
  });

  describe('fetchById', () => {
    it('calls findOne in userRepository, if product is found, returns a product', async () => {
      expect.assertions(2);
      await expect(productService.fetchById(10)).resolves.toEqual({
        id: 10,
        categoryId: expect.any(String),
        title: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        description: expect.any(String),
        status: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(productRepository.findOne).toHaveBeenCalledWith(10);
    });
  });

  describe('create', () => {
    it('calls createProduct in ProductRepository and returns the new product', async () => {
      const dto = {
        title: 'ice cream',
        image: 'https://i.imgur.com/Hiw0N.jpg',
        price: 9.5,
        description: 'i like ice cream',
        category: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
      };
      expect.assertions(2);
      await expect(productService.create(dto)).resolves.toEqual({
        id: expect.any(Number),
        categoryId: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
        title: 'ice cream',
        image: 'https://i.imgur.com/Hiw0N.jpg',
        price: 9.5,
        description: 'i like ice cream',
        status: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(productRepository.createProduct).toHaveBeenCalledWith(dto);
    });
  });

  describe('remove', () => {
    it('calls delete in productRepository to delete the product', async () => {
      expect.assertions(2);
      productRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(productService.remove(10)).resolves.not.toThrow();
      expect(productRepository.delete).toHaveBeenCalledWith(10);
    });

    it('throws an error for getting missing id', async () => {
      expect.assertions(2);
      productRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(() => productService.remove(10)).rejects.toThrow(NotFoundException);
      expect(productRepository.delete).toHaveBeenCalledWith(10);
    });
  });

  describe('update', () => {
    it('calls fetchById in the productService to fetch the product and then calls the new updated parameters to replace the existing product attributes', async () => {
      const dto = { title: 'chocolate' };
      expect.assertions(2);
      const updatedProduct = await productService.update(10, dto);
      expect(productRepository.findOne).toHaveBeenCalledWith(10);
      expect(productRepository.save).toHaveBeenCalledWith(updatedProduct);
    });

    it('throws an error for giving missing id', async () => {
      const dto = { title: 'chocolate' };
      expect.assertions(3);
      productRepository.findOne.mockResolvedValue(undefined);
      await expect(productService.update(11, dto)).rejects.toThrow();
      expect(productRepository.findOne).toHaveBeenCalledWith(11);
      expect(productRepository.save).not.toHaveBeenCalled();
    });
  });
});
