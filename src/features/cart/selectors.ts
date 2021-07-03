import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { CartItemDto, CartState } from './cartSlice';

const selectRoot = (state: RootState) => state.cart;

export const selectCartItems = createSelector([selectRoot], (cart: CartState) => cart.items);

export const selectOpen = createSelector([selectRoot], (cart: CartState) => cart.isOpen);

export const selectQuantity = createSelector([selectRoot], (cart: CartState) => cart.quantity);

export const selectCartTotal = createSelector([selectCartItems], (items: CartItemDto[]) =>
  items.reduce((accumulator, cartItem) => accumulator + cartItem.price * cartItem.quantity, 0)
);

/* contains the logic to differentiate between items
 * with the same id, so only quantity gets added
 * instead of another item being added as a CartItem */
export const addItemToCart = (cartItems: CartItemDto[], cartItem: CartItemDto): CartItemDto[] => {
  if (cartItem.id === '' || cartItem.id === undefined || cartItem.id === null) {
    throw new Error('Cart Item is missing ID');
  }
  const existingItem = cartItems.find((item: CartItemDto) => item.id == cartItem.id);
  if (existingItem) {
    return cartItems.map((item: CartItemDto) =>
      item.id == cartItem.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  return [...cartItems, { ...cartItem, quantity: 1 }];
};

export const removeItemFromCart = (
  cartItems: CartItemDto[],
  cartItem: CartItemDto
): CartItemDto[] => {
  const existingItem = cartItems.find((item: CartItemDto) => item.id == cartItem.id);

  /* if items quantity is 1, remove the whole item */
  if (existingItem && existingItem.quantity === 1) {
    return cartItems.filter((item) => item.id !== cartItem.id);
  }

  /* otherwise, only decrement the quantity */
  return cartItems.map((item) =>
    item.id == cartItem.id ? { ...item, quantity: item.quantity - 1 } : item
  );
};
