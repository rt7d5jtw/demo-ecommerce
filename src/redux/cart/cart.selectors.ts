import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { CartItem, CartState } from '../types';

const selectCart = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  [selectCart],
  (cart: CartState) => cart.cartItems
)

export const selectOpen = createSelector(
  [selectCart],
  (cart: CartState) => cart.isOpen
)

export const selectQuantity = createSelector(
  [selectCart],
  (cart: CartState) => cart.quantity
)

export const selectCartTotal = createSelector(
  [selectCartItems],
  (cartItems: any[]) => cartItems.reduce(
    (accumulator, cartItem) =>
      accumulator + cartItem.price * cartItem.quantity,
    0
  )
);
