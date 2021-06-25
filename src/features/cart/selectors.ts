import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { CartItem, CartState } from './cartSlice';

const selectRoot = (state: RootState) => state.cart;

export const selectCartItems = createSelector([selectRoot], (cart: CartState) => cart.items);

export const selectOpen = createSelector([selectRoot], (cart: CartState) => cart.isOpen);

export const selectQuantity = createSelector([selectRoot], (cart: CartState) => cart.quantity);

export const selectCartTotal = createSelector([selectCartItems], (items: CartItem[]) =>
  items.reduce((accumulator, cartItem) => accumulator + cartItem.price * cartItem.quantity, 0)
);

export const addItemToCart = (cartItems: CartItem[], cartItem: CartItem): CartItem[] => {
  const existingItem = cartItems.find((item: CartItem) => item.id == cartItem.id);
  if (existingItem) {
    return cartItems.map((item: CartItem) =>
      item.id == cartItem.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  return [...cartItems, { ...cartItem, quantity: 1 }];
};

export const removeItemFromCart = (cartItems: CartItem[], cartItem: CartItem): CartItem[] => {
  const existingItem = cartItems.find((item: CartItem) => item.id == cartItem.id);

  if (existingItem && existingItem.quantity === 1) {
    return cartItems.filter((item) => item.id !== cartItem.id);
  }

  return cartItems.map((item) =>
    item.id == cartItem.id ? { ...item, quantity: item.quantity - 1 } : item
  );
};
