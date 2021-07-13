import { Test } from '@nestjs/testing';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

describe('productRepository', () => {
  let productRepository: any;

  jest.mock('./product.entity');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductRepository],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  describe('fetch', () => {
    const result = {
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
    };
    it('calls querybuilder to execute a query to search for products and returns product(s) as a product array', async () => {
      productRepository.createQueryBuilder = jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(result),
      });
      expect(productRepository.fetch({ search: 'Dune' })).resolves.toEqual({
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
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      productRepository.create = jest.fn().mockReturnValue({ save });
    });
    it('calls a new instance of Product entity and saves it', async () => {
      const product = new Product();
      product.save = jest.fn().mockReturnThis();
      save.mockResolvedValue(undefined);
      const dto = {
        title: 'stuff',
        image: 'wat',
        price: 1.45,
        author: 'Yeet',
        description: 'no',
        category: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
      };
      await expect(productRepository.createProduct(dto)).resolves.not.toThrow();
    });
  });
});
