import { rest } from 'msw';
import { server } from '../mocks/server';
import {
  ORDER_URL,
  fetchOrders,
  fetchAllOrders,
  createOrder,
  removeOrder,
  updateOrder,
} from './api';
import { OrderStatus } from './orderSlice';

describe('Order API tests', () => {
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  describe('fetchOrders', () => {
    it('returns orders array with users orders', async () => {
      const result = await fetchOrders();
      expect(result).toEqual([
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
      ]);
      if (result[0].id && result[0].userId != null) {
        expect(uuidRegex.test(result[0].id)).toEqual(true);
        expect(uuidRegex.test(result[0].userId)).toEqual(true);
      }
    });

    it('throws an for unauthorized', async () => {
      server.use(
        rest.get(ORDER_URL, (_req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              statusCode: 401,
              message: 'Unauthorized',
            })
          );
        })
      );
      expect(fetchOrders()).rejects.toThrow('401');
    });
  });

  describe('fetchAllOrders', () => {
    it('returns an array of all the orders in the database', async () => {
      const result = await fetchAllOrders();
      expect(result).toEqual([
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
      ]);
      if (
        result[0].id &&
        result[0].userId &&
        result[1].id &&
        result[1].userId != null
      ) {
        expect(uuidRegex.test(result[0].id)).toEqual(true);
        expect(uuidRegex.test(result[0].userId)).toEqual(true);
        expect(uuidRegex.test(result[1].id)).toEqual(true);
        expect(uuidRegex.test(result[1].userId)).toEqual(true);
      }
    });

    it('throws an error for unauthorized', async () => {
      server.use(
        rest.get(ORDER_URL + 'all', (_req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              statusCode: 401,
              message: 'Unauthorized',
            })
          );
        })
      );
      expect(fetchAllOrders()).rejects.toThrow('401');
    });
  });

  describe('createOrder', () => {
    const arg = {
      total_price: 15,
      address: 'Yeetstreet',
      country: 'Finland',
      city: 'Helsinki',
      postalcode: '01000',
      status: OrderStatus.UNPAID,
    };
    it('returns the created order', async () => {
      const result = await createOrder(arg);
      expect(result).toEqual({
        id: expect.any(String),
        userId: expect.any(String),
        total_price: expect.any(Number),
        country: expect.any(String),
        city: expect.any(String),
        address: expect.any(String),
        postalcode: expect.any(String),
        status: expect.any(String),
        date: expect.any(String),
      });
      if (result.id && result.userId != null) {
        expect(uuidRegex.test(result.id)).toEqual(true);
        expect(uuidRegex.test(result.userId)).toEqual(true);
      }
    });

    it('throws an for not including values', async () => {
      server.use(
        rest.post(ORDER_URL, (_req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              statusCode: 422,
              message: 'Missing values from the order',
              error: 'Unprocessable Entity',
            })
          );
        })
      );
      const argCopy = JSON.parse(JSON.stringify(arg));
      Object.assign(arg, argCopy);
      delete argCopy.total_price;
      expect(createOrder(arg)).rejects.toThrow('422');
    });
  });

  describe('updateOrder', () => {
    it('updates an order by calling api with id and returns updated properties', async () => {
      expect(
        updateOrder('490f374c-b448-4a7b-ad2c-0bedb9fe2163', {
          status: OrderStatus.PAID,
        })
      ).resolves.toEqual({
        id: '490f374c-b448-4a7b-ad2c-0bedb9fe2163',
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        status: 'PAID',
        date: '2021-07-23',
      });
    });
  });

  describe('removeOrder', () => {
    it('deletes an order and items in it and returns void', async () => {
      await expect(
        removeOrder('9f0bcbf5-c845-48ef-95dd-393da9ae64c1')
      ).resolves.toBe('');
    });

    it('throws an error for providing existing id', async () => {
      server.use(
        rest.delete(
          ORDER_URL + '8335aea-2064-49dd-9773-c57d41a301c2',
          (_req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({
                statusCode: 500,
                message: 'Internal server error',
              })
            );
          }
        )
      );
      expect(
        removeOrder('8335aea-2064-49dd-9773-c57d41a301c2')
      ).rejects.toThrow('500');
    });
  });
});
