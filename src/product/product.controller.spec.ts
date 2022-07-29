import { Test } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { arrayOfProducts } from '../../test/testdata.json';

const mockProductService = () => ({
  fetch: jest.fn().mockResolvedValue(arrayOfProducts),
  fetchById: jest.fn().mockResolvedValue({
    id: 10,
    categories: [
      {
        id: '4b625d6c-2a13-4616-870e-9fbb235af59d',
        cname: 'Dark Chocolate'
      },
      {
        id: '273b6d03-46fa-49a7-bb47-ff141e814b0e',
        cname: 'Chocolate truffles'
      }
    ],
    title: 'Bear nap',
    image: 'https://i.imgur.com/CHFUX10.png',
    price: 420,
    description: 'Fluffy bear',
    status: 'IN_STOCK',
    created_at: '2021-07-02',
    updated_at: '2021-07-02'
  }),
  create: jest.fn().mockResolvedValue({
    title: 'ice cream',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    price: 9.5,
    description: 'i like ice cream',
    status: 'IN_STOCK',
    categories: [
      {
        id: '4b625d6c-2a13-4616-870e-9fbb235af59d',
        cname: 'Dark Chocolate'
      },
      {
        id: '273b6d03-46fa-49a7-bb47-ff141e814b0e',
        cname: 'Chocolate truffles'
      }
    ],
    id: 33,
    created_at: '2021-07-10',
    updated_at: '2021-07-10'
  }),
  update: jest.fn((id, dto) => {
    const obj = {
      id,
      categories: [
        {
          id: '4b625d6c-2a13-4616-870e-9fbb235af59d',
          cname: 'Dark Chocolate'
        },
        {
          id: '273b6d03-46fa-49a7-bb47-ff141e814b0e',
          cname: 'Chocolate truffles'
        }
      ],
      title: 'Bear nap',
      image: 'https://i.imgur.com/CHFUX10.png',
      price: 420,
      description: 'Fluffy bear',
      status: 'IN_STOCK',
      created_at: '2021-07-02',
      updated_at: '2021-07-02'
    };
    const result = {
      ...obj,
      ...dto
    };
    return Promise.resolve(result);
  }),
  remove: jest.fn(() => Promise.resolve(undefined))
});

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useFactory: mockProductService }]
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
      expect(await productController.fetch(undefined)).toEqual([
        {
          id: expect.any(Number),
          categories: expect.any(Array),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          description: expect.any(String),
          status: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String)
        },
        {
          id: expect.any(Number),
          categories: expect.any(Array),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          description: expect.any(String),
          status: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String)
        },
        {
          id: expect.any(Number),
          categories: expect.any(Array),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          description: expect.any(String),
          status: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String)
        }
      ]);
      expect(productService.fetch).toHaveBeenCalled();
    });
  });

  describe('fetchById', () => {
    it('returns a product by id specfied by calling the productService', async () => {
      expect.assertions(2);
      expect(await productController.fetchById(10)).toEqual({
        id: expect.any(Number),
        categories: expect.any(Array),
        title: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        description: expect.any(String),
        status: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
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
        categoryIds: [
          { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
          {
            id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
            cname: 'Milk Chocolate'
          }
        ]
      };
      expect.assertions(2);
      expect(await productController.create(dto)).toEqual({
        id: expect.any(Number),
        categories: expect.any(Array),
        title: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        description: expect.any(String),
        status: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });
      expect(productService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('updates existing product by calling productService', async () => {
      expect(await productController.update(10, { price: 1.25 })).toEqual({
        id: 10,
        categories: expect.any(Array),
        title: expect.any(String),
        image: expect.any(String),
        price: 1.25,
        description: expect.any(String),
        status: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });
    });
  });

  describe('deleteProductById', () => {
    it('deletes a product by calling productService', async () => {
      expect(await productController.remove(10)).toBeUndefined();
      expect(productService.remove).toHaveBeenCalledWith(10);
    });
  });
});
