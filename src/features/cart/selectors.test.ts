import { addItemToCart, removeItemFromCart } from './selectors';

const mockCart = [
  {
    productId: 28,
    title: 'chocolate',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    quantity: 1,
    price: 9.5,
  },
  {
    title: 'Burger',
    image: 'https://i.imgur.com/kpu7hRD.jpeg',
    productId: 20,
    quantity: 1,
    price: 14,
  },
  {
    title: 'ciabatta',
    image: 'https://i.imgur.com/dNr0ndm.jpg',
    productId: 19,
    quantity: 1,
    price: 1.5,
  },
];

describe('Cart Selectors', () => {
  describe('addItemToCart', () => {
    const newItem = {
      title: 'ciabatta',
      image: 'https://i.imgur.com/dNr0ndm.jpg',
      productId: 19,
      quantity: 1,
      price: 1.5,
    };
    it('adds items and items with same id get only added in quantity', () => {
      expect(addItemToCart(mockCart, newItem)).toEqual(
        expect.arrayContaining([
          {
            productId: 28,
            title: 'chocolate',
            image: 'https://i.imgur.com/Hiw0N.jpg',
            quantity: 1,
            price: 9.5,
          },
          {
            title: 'Burger',
            image: 'https://i.imgur.com/kpu7hRD.jpeg',
            productId: 20,
            quantity: 1,
            price: 14,
          },
          {
            title: 'ciabatta',
            image: 'https://i.imgur.com/dNr0ndm.jpg',
            productId: 19,
            quantity: 2,
            price: 1.5,
          },
        ])
      );
    });
  });

  describe('removeItemFromCart', () => {
    const itemToDelete = {
      productId: 28,
      title: 'chocolate',
      image: 'https://i.imgur.com/Hiw0N.jpg',
      quantity: 1,
      price: 9.5,
    };
    it('removes an item from cart if qty is 1, otherwise only decrements qty', () => {
      expect(removeItemFromCart(mockCart, itemToDelete)).toEqual([
        {
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
          quantity: expect.any(Number),
          price: expect.any(Number),
        },
        {
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
          quantity: expect.any(Number),
          price: expect.any(Number),
        },
      ]);
    });
  });
});
