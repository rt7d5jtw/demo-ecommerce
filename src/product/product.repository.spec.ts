import { Test } from '@nestjs/testing';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import * as typeorm from 'typeorm';

const cats = [
  { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
  { id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa', cname: 'Milk Chocolate' },
];

describe('productRepository', () => {
  let productRepository: any;

  jest.mock('./product.entity');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductRepository],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
  });
  const result = {
    id: 8,
    categories: [
      { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
      { id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa', cname: 'Milk Chocolate' },
    ],
    title: 'Dune',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    price: 12,
    description: 'nice boek',
    status: 'IN_STOCK',
    createdAt: '2021-07-02',
    updatedAt: '2021-07-02',
  };

  describe('fetch', () => {
    it('calls querybuilder to execute a query to search for products and returns product(s) as a product array', async () => {
      productRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(result),
      });
      expect(productRepository.fetch({ search: 'Dune' })).resolves.toEqual({
        id: expect.any(Number),
        categories: expect.any(Array),
        title: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
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
    let save: any;
    beforeEach(() => {
      save = jest.fn();
      productRepository.create = jest.fn().mockReturnValue({ save });
    });
    it('calls a new instance of Product entity and saves it', async () => {
      jest.spyOn(typeorm, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation(() => ({
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(cats),
          })),
        };
      });
      const product = new Product();
      product.save = jest.fn().mockReturnValue(result);
      save.mockResolvedValue(product);
      const dto = {
        title: 'stuff',
        image: 'wat',
        price: 1.45,
        description: 'no',
        categoryIds: [
          { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
          { id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa', cname: 'Milk Chocolate' },
        ],
      };
      await expect(productRepository.createProduct(dto)).resolves.not.toThrow();
    });
  });
});
