import { rest } from 'msw';
import { server } from '../mocks/server';
import {
  ORDER_URL,
  fetchOrders,
  fetchAllOrders,
  createOrder,
  addOrderItems,
  removeOrder,
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
      if (result[0].id && result[0].userId && result[1].id && result[1].userId != null) {
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

  describe('addOrderItems', () => {
    it('returns order items array of added items', async () => {
      const result = await addOrderItems('0302370c-6f80-4932-9dd6-6364d01bf936');
      expect(result).toEqual([
        {
          id: expect.any(String),
          cartId: expect.any(String),
          productId: expect.any(Number),
          quantity: expect.any(Number),
          price: expect.any(Number),
          CreatedAt: expect.any(String),
        },
      ]);
      expect(uuidRegex.test(result[0].id)).toEqual(true);
      expect(uuidRegex.test(result[0].cartId)).toEqual(true);
    });

    it('throws an error for providing no orderId', async () => {
      server.use(
        rest.post(ORDER_URL + 'items/', (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'Cannot POST /orders/items/',
              error: 'Not Found',
            })
          );
        })
      );
      expect(addOrderItems('')).rejects.toThrow('404');
    });
  });

  describe('removeOrder', () => {
    it('deletes an order and items in it and returns void', async () => {
      await expect(removeOrder('9f0bcbf5-c845-48ef-95dd-393da9ae64c1')).resolves.toBe('');
    });

    it('throws an error for providing existing id', async () => {
      server.use(
        rest.delete(ORDER_URL + '8335aea-2064-49dd-9773-c57d41a301c2', (_req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              statusCode: 500,
              message: 'Internal server error',
            })
          );
        })
      );
      expect(removeOrder('8335aea-2064-49dd-9773-c57d41a301c2')).rejects.toThrow('500');
    });
  });
});
