import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import axios, { AxiosError } from 'axios';
import { RootState } from '../root-reducer';
import { CartItem, CartState } from '../types';

type SliceState = {
  isOpen: boolean;
  items: CartItem[];
  quantity: number;
  price: number;
};

export const clearCart = createAction('cart/clearCart');

export const cartToggle = createAction<boolean>('cart/cartToggle');

export const addItem = createAction<CartItem>('cart/addItem');

export const removeItem = createAction<CartItem>('cart/removeItem');

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    isOpen: false,
    items: [],
    quantity: 0,
    price: 0,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
    cartToggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    addItem: (state, { payload }) => {
      state.items = addItemToCart(state.items, payload);
      state.quantity = state.quantity + 1;
      state.price;
    },
    removeItem: (state, { payload }) => {
      state.items = removeItemFromCart(state.items, payload);
      state.quantity = state.quantity - 1;
    },
  },
  extraReducers: {},
});

const selectRoot = (state: RootState) => state.cart;

export const selectCartItems = createSelector([selectRoot], (cart: CartState) => cart.items);

export const selectOpen = createSelector([selectRoot], (cart: CartState) => cart.isOpen);

export const selectQuantity = createSelector([selectRoot], (cart: CartState) => cart.quantity);

export const selectCartTotal = createSelector([selectCartItems], (items: any[]) =>
  items.reduce((accumulator, cartItem) => accumulator + cartItem.price * cartItem.quantity, 0)
);

export const addItemToCart = (cartItems: CartItem[], cartItem: CartItem) => {
  const existingItem = cartItems.find((item: CartItem) => item.id == cartItem.id);
  if (existingItem) {
    return cartItems.map((item: any) =>
      item.id == cartItem.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  return [...cartItems, { ...cartItem, quantity: 1 }];
};

export const removeItemFromCart = (cartItems: CartItem[], cartItem: CartItem) => {
  const existingItem = cartItems.find((item: CartItem) => item.id == cartItem.id);

  if (existingItem && existingItem.quantity === 1) {
    return cartItems.filter((item) => item.id !== cartItem.id);
  }

  return cartItems.map((item) =>
    item.id == cartItem.id ? { ...item, quantity: item.quantity - 1 } : item
  );
};

export default cartSlice.reducer;
