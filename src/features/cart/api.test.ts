import { rest } from 'msw';
import { server } from '../mocks/server';
import {
  addItemToCartDB,
  CART_URL,
  checkIfCart,
  clearCartState,
  createCart,
  fetchCart,
  fetchCartInfo,
  removeItemFromCartDB,
} from './api';

describe('Cart API Unit tests', () => {
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  describe('fetchCart', () => {
    it('fetches user cart and returns it', async () => {
      const result = await fetchCart();
      expect(result).toEqual({
        id: expect.any(String),
        userId: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(uuidRegex.test(result.id)).toEqual(true);
      expect(uuidRegex.test(result.userId)).toEqual(true);
    });
  });

  describe('createCart', () => {
    it('creates a cart for user and returns it', async () => {
      const result = await createCart();
      expect(result).toEqual({
        id: expect.any(String),
        userId: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(uuidRegex.test(result.id)).toEqual(true);
      expect(uuidRegex.test(result.userId)).toEqual(true);
    });
  });

  describe('checkIfCart', () => {
    it('checks if user has a cart, if not creates one otherwise returns null', async () => {
      expect.assertions(1);
      const result = await checkIfCart();
      expect(result).toEqual(undefined);
    });
  });

  describe('fetchCartInfo', () => {
    it('returns cart items', async () => {
      const result = await fetchCartInfo();
      expect(result).toEqual([
        {
          cartId: expect.any(String),
          productId: expect.any(Number),
          id: expect.any(String),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
        },
        {
          cartId: expect.any(String),
          productId: expect.any(Number),
          id: expect.any(String),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
        },
      ]);
      expect(uuidRegex.test(result[0].id)).toEqual(true);
      expect(uuidRegex.test(result[0].cartId)).toEqual(true);
      expect(uuidRegex.test(result[1].id)).toEqual(true);
      expect(uuidRegex.test(result[1].cartId)).toEqual(true);
    });

    it('throws an error for nonexistant cart', async () => {
      server.use(
        rest.get(CART_URL + 'cartInfo', (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'User has no cart',
              error: 'Not Found',
            })
          );
        })
      );
      expect(fetchCartInfo()).rejects.toThrow('404');
    });
  });

  describe('addItemToCartDB', () => {
    it('returns added cart item to cart', async () => {
      const result = await addItemToCartDB(28);
      expect(result).toEqual({
        cartId: expect.any(String),
        quantity: '1',
        price: expect.any(Number),
        productId: 28,
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(uuidRegex.test(result.id)).toEqual(true);
      expect(uuidRegex.test(result.cartId)).toEqual(true);
    });

    /* providing nonexistant id leads to function not finding price */
    it('throws an error for not providing nonexistant id', async () => {
      server.use(
        rest.post(CART_URL + 282, (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'Price could not be found',
              error: 'Not Found',
            })
          );
        })
      );
      expect(addItemToCartDB(282)).rejects.toThrow('404');
    });
  });

  describe('removeItemFromCartDB', () => {
    it('removes item from cart and returns void', async () => {
      expect.assertions(2);
      await expect(removeItemFromCartDB(28)).resolves.not.toThrow();
    });

    it('throws error for providing nonexistant id in the cart', async () => {
      server.use(
        rest.delete(CART_URL + 28, (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'Cart Item with ID "28" not found',
              error: 'Not Found',
            })
          );
        })
      );
      expect(removeItemFromCartDB(28)).rejects.toThrow('404');
    });
  });

  describe('clearCartState', () => {
    it('removes all items from the cart and returns void', async () => {
      expect.assertions(2);
      await expect(clearCartState()).resolves.not.toThrow();
    });

    it('throws an error for nonexistant cart', async () => {
      server.use(
        rest.delete(CART_URL, (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'No cart found',
              error: 'Not Found',
            })
          );
        })
      );
      expect(clearCartState()).rejects.toThrow('404');
    });
  });
});
