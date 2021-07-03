import { addItemToCart, removeItemFromCart } from './selectors';

const mockCart = [
  {
    id: 'b448dcfe-53fb-4255-8967-89c485f33f74',
    cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
    productId: 28,
    title: 'chocolate',
    image: 'https://i.imgur.com/Hiw0N.jpg',
    quantity: 1,
    price: 9.5,
    CreatedAt: '2021-07-03',
  },
  {
    id: '67786288-df3d-41b3-bc28-a7226916c920',
    cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
    title: 'Burger',
    image: 'https://i.imgur.com/kpu7hRD.jpeg',
    productId: 20,
    quantity: 1,
    price: 14,
    CreatedAt: '2021-07-03',
  },
  {
    id: '788ddee8-7331-483b-a467-1cfdd0605ea2',
    cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
    title: 'ciabatta',
    image: 'https://i.imgur.com/dNr0ndm.jpg',
    productId: 19,
    quantity: 1,
    price: 1.5,
    CreatedAt: '2021-07-03',
  },
];

describe('Cart Selectors', () => {
  describe('addItemToCart', () => {
    const newItem = {
      id: '788ddee8-7331-483b-a467-1cfdd0605ea2',
      cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
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
            id: 'b448dcfe-53fb-4255-8967-89c485f33f74',
            cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
            productId: 28,
            title: 'chocolate',
            image: 'https://i.imgur.com/Hiw0N.jpg',
            quantity: 1,
            price: 9.5,
            CreatedAt: '2021-07-03',
          },
          {
            id: '67786288-df3d-41b3-bc28-a7226916c920',
            cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
            title: 'Burger',
            image: 'https://i.imgur.com/kpu7hRD.jpeg',
            productId: 20,
            quantity: 1,
            price: 14,
            CreatedAt: '2021-07-03',
          },
          {
            id: '788ddee8-7331-483b-a467-1cfdd0605ea2',
            cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
            title: 'ciabatta',
            image: 'https://i.imgur.com/dNr0ndm.jpg',
            productId: 19,
            quantity: 2,
            price: 1.5,
            CreatedAt: '2021-07-03',
          },
        ])
      );
    });

    it('throws an error for providing empty ID', () => {
      const noIDItem = {
        id: '',
        cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
        title: 'Burger',
        image: 'https://i.imgur.com/kpu7hRD.jpeg',
        productId: 20,
        quantity: 1,
        price: 14,
        CreatedAt: '2021-07-03',
      };
      expect(() => addItemToCart(mockCart, noIDItem)).toThrow(Error);
    });
  });

  describe('removeItemFromCart', () => {
    const itemToDelete = {
      id: 'b448dcfe-53fb-4255-8967-89c485f33f74',
      cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
      productId: 28,
      title: 'chocolate',
      image: 'https://i.imgur.com/Hiw0N.jpg',
      quantity: 1,
      price: 9.5,
      CreatedAt: '2021-07-03',
    };
    it('removes an item from cart if qty is 1, otherwise only decrements qty', () => {
      expect(removeItemFromCart(mockCart, itemToDelete)).toEqual([
        {
          id: expect.any(String),
          cartId: expect.any(String),
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
          quantity: expect.any(Number),
          price: expect.any(Number),
          CreatedAt: expect.any(String),
        },
        {
          id: expect.any(String),
          cartId: expect.any(String),
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
          quantity: expect.any(Number),
          price: expect.any(Number),
          CreatedAt: expect.any(String),
        },
      ]);
    });
  });
});
