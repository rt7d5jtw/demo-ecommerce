import { rest } from 'msw';
import { server } from '../mocks/server';
import {
  createProduct,
  fetchProducts,
  removeProduct,
  PRODUCT_URL,
  updateProduct,
  searchProducts,
} from './api';

describe('Product API Unit tests', () => {
  describe('fetchProducts', () => {
    it('returns an array of products', async () => {
      const result = await fetchProducts();
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
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
          }),
        ])
      );
    });

    it('returns a rejected promise with an error', async () => {
      server.use(
        rest.get(PRODUCT_URL, (_req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              statusCode: 401,
              message: 'Unauthorized',
            })
          );
        })
      );
      expect(() => fetchProducts()).rejects.toThrow('401');
    });
  });

  describe('createProduct', () => {
    const arg = {
      title: 'chocolate',
      image: 'https://i.imgur.com/Hiw0N.jpg',
      price: 9.5,
      description: 'i like chocolate',
      author: 'Herbert',
      categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
    };
    it('returns the created product', async () => {
      const result = await createProduct(arg);
      expect(result).toEqual({
        title: 'chocolate',
        image: 'https://i.imgur.com/Hiw0N.jpg',
        price: '9.50',
        description: 'i like chocolate',
        status: 'IN_STOCK',
        author: 'Herbert',
        categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('throws an bad request error', async () => {
      server.use(
        rest.post(PRODUCT_URL, (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              statusCode: 400,
              message: ['category must be a string'],
              error: 'Bad Request',
            })
          );
        })
      );
      /* copying arg obj to delete categoryId */
      const argCopy = JSON.parse(JSON.stringify(arg));
      Object.assign(arg, argCopy);
      delete argCopy.categoryId;
      expect(() => createProduct(argCopy)).rejects.toThrow('400');
    });
  });

  describe('removeProduct', () => {
    it('removes a product and returns void', async () => {
      expect(removeProduct(20)).resolves.toEqual('');
    });

    it('throws an error', async () => {
      server.use(
        rest.delete(PRODUCT_URL + `/323`, (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'Product with ID "323" not found',
              error: 'Not Found',
            })
          );
        })
      );
      expect(() => removeProduct(323)).rejects.toThrow('404');
    });
  });

  describe('updateProduct', () => {
    it('returns a product', async () => {
      const result = await updateProduct({
        id: 19,
        title: 'Ciabatta',
        image: 'https://i.imgur.com/dNr0ndm.jpg',
        price: 1.5,
        description: 'a tasty ciabatta',
      });
      expect(result).toEqual({
        id: 19,
        categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
        title: 'Ciabatta',
        image: 'https://i.imgur.com/dNr0ndm.jpg',
        price: '1.5',
        description: 'a tasty ciabatta',
        status: 'IN_STOCK',
        createdAt: '2021-07-02',
        updatedAt: '2021-07-02',
      });
    });

    it('throws an error', async () => {
      server.use(
        rest.patch(PRODUCT_URL + `/19`, (_req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              statusCode: 401,
              message: 'Unauthorized',
            })
          );
        })
      );
      expect(
        updateProduct({
          id: 19,
          categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
          title: 'Ciabatta',
          image: 'https://i.imgur.com/dNr0ndm.jpg',
          price: 1.5,
          description: 'a tasty ciabatta',
        })
      ).rejects.toThrow('401');
    });
  });

  describe('searchProducts', () => {
    it('returns search term and a product array', async () => {
      const result = await searchProducts('Dune');
      expect(result).toEqual(
        expect.objectContaining({
          search: 'Dune',
          data: expect.arrayContaining([
            {
              id: 8,
              categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
              title: 'Dune',
              image: 'https://i.imgur.com/Hiw0N.jpg',
              price: 12,
              author: 'Bob',
              description: expect.any(String),
              status: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ]),
        })
      );
    });
  });
});
