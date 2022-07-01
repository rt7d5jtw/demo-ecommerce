import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchProductDto } from './dto/search-product.dto';
import { Product } from './product.entity';
import { ProductRepositoryExtended } from './product.repository';

const mockProductRepository = () => ({
  fetch: jest.fn(),
});

describe('productRepository', () => {
  let productRepository: Repository<Product> & ProductRepositoryExtended;

  jest.mock('./product.entity');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository,
        },
      ],
    }).compile();

    productRepository = module.get<Repository<Product> & ProductRepositoryExtended>(
      getRepositoryToken(Product)
    );
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
      expect(await productRepository.fetch({ search: 'Dune' } as SearchProductDto)).toEqual({
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
});
