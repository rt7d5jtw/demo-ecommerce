import { Test } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

export const productArr = [
  {
    id: 8,
    categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
    title: 'Dune',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    price: 12,
    author: 'Bob',
    description: 'nice boek',
    status: 'IN_STOCK',
    createdAt: '2021-07-02',
    updatedAt: '2021-07-02',
  },
  {
    id: 18,
    categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
    title: 'Stranger',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    price: 9.5,
    author: 'Herbert',
    description: 'i like ice cream',
    status: 'IN_STOCK',
    createdAt: '2021-07-02',
    updatedAt: '2021-07-02',
  },
  {
    id: 10,
    categoryId: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
    title: 'Bear nap',
    image: 'https://i.imgur.com/CHFUX10.png',
    price: 420,
    author: 'Bear',
    description: 'Fluffy bear',
    status: 'IN_STOCK',
    createdAt: '2021-07-02',
    updatedAt: '2021-07-02',
  },
];

const mockProductService = () => ({
  fetch: jest.fn().mockResolvedValue(productArr),
  fetchById: jest.fn().mockResolvedValue({
    id: 10,
    categoryId: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
    title: 'Bear nap',
    image: 'https://i.imgur.com/CHFUX10.png',
    price: 420,
    author: 'Bear',
    description: 'Fluffy bear',
    status: 'IN_STOCK',
    createdAt: '2021-07-02',
    updatedAt: '2021-07-02',
  }),
  create: jest.fn().mockResolvedValue({
    title: 'ice cream',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    price: 9.5,
    description: 'i like ice cream',
    status: 'IN_STOCK',
    author: 'Herbert',
    categoryId: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
    id: 33,
    createdAt: '2021-07-10',
    updatedAt: '2021-07-10',
  }),
  update: jest.fn((id, dto) => {
    const obj = {
      id,
      categoryId: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
      title: 'Bear nap',
      image: 'https://i.imgur.com/CHFUX10.png',
      price: 420,
      author: 'Bear',
      description: 'Fluffy bear',
      status: 'IN_STOCK',
      createdAt: '2021-07-02',
      updatedAt: '2021-07-02',
    };
    const result = {
      ...obj,
      ...dto,
    };
    return Promise.resolve(result);
  }),
  remove: jest.fn(() => Promise.resolve(undefined)),
});

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useFactory: mockProductService }],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it('returns a product array by calling productService', async () => {
      expect.assertions(2);
      await expect(productController.fetch(undefined)).resolves.toEqual([
        {
          id: expect.any(Number),
          categoryId: expect.any(String),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          author: expect.any(String),
          description: expect.any(String),
          status: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          categoryId: expect.any(String),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          author: expect.any(String),
          description: expect.any(String),
          status: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          categoryId: expect.any(String),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          author: expect.any(String),
          description: expect.any(String),
          status: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
      expect(productService.fetch).toHaveBeenCalled();
    });
  });

  describe('fetchById', () => {
    it('returns a product by id specfied by calling the productService', async () => {
      expect.assertions(2);
      await expect(productController.fetchById(10)).resolves.toEqual({
        id: expect.any(Number),
        categoryId: expect.any(String),
        title: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        author: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(productService.fetchById).toHaveBeenCalledWith(10);
    });
  });

  describe('create', () => {
    it('creates a new product and returns it by calling productService', async () => {
      const dto = {
        title: 'ice cream',
        image: 'https://i.imgur.com/Hiw0N.jpg',
        price: 9.5,
        description: 'i like ice cream',
        author: 'Herbert',
        category: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
      };
      expect.assertions(2);
      await expect(productController.create(dto)).resolves.toEqual({
        id: expect.any(Number),
        categoryId: expect.any(String),
        title: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        author: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(productService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('updates existing product by calling productService', async () => {
      await expect(productController.update(10, { price: 1.25 })).resolves.toEqual({
        id: 10,
        categoryId: expect.any(String),
        title: expect.any(String),
        image: expect.any(String),
        price: 1.25,
        author: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('deleteProductById', () => {
    it('deletes a product by calling productService', async () => {
      expect.assertions(2);
      await expect(productController.remove(10)).resolves.not.toThrow();
      expect(productService.remove).toHaveBeenCalledWith(10);
    });
  });
});
