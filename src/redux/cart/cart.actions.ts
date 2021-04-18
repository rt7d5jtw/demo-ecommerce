import { Product } from '../types';
import { CartConstants } from './cart.constants';
import { CartItem } from '../types';

export const addItemToCart = (cartItems: CartItem[], cartItem: CartItem) => {
  const existingItem = cartItems.find(
    (item: CartItem) => item.id == cartItem.id
  );
  if (existingItem) {
    return cartItems.map((item: any) =>
      item.id == cartItem.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  return [...cartItems, { ...cartItem, quantity: 1 }];
}

export const removeItemFromCart = (cartItems: CartItem[], cartItem: CartItem) => {
  const existingItem = cartItems.find(
    (item: CartItem) => item.id == cartItem.id
  );

  if (existingItem && existingItem.quantity === 1) {
    return cartItems.filter(item => item.id !== cartItem.id);
  }

  return cartItems.map(item =>
    item.id == cartItem.id
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );
}

/* shows/hides cart in the webpage */
export const cartToggle = (isOpen: boolean) => ({
  type: CartConstants.CART_TOGGLE,
  payload: { isOpen }
})

/* adds item to cart */
export const addItem = (cartItem: Product) => ({
  type: CartConstants.ADD_ITEM,
  payload: cartItem
})

export const removeCartItem = (cartItem: CartItem) => ({
  type: CartConstants.REMOVE_ITEM,
  payload: cartItem
})

export const clearCart = () => ({
  type: CartConstants.CLEAR_CART
})
