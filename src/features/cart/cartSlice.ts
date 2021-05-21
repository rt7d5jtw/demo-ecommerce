import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import axios, { AxiosError } from 'axios';
import { authHeader } from '../user/userSlice';
import { ValidationErrors } from '../promotion/promotionSlice';

export const CART_URL = 'http://localhost:3000/cart/';

export const clearCart = createAction('cart/clearCart');

export const cartToggle = createAction<boolean>('cart/cartToggle');

export const addItem = createAction<CartItem>('cart/addItem');

export const removeItem = createAction<CartItem>('cart/removeItem');

export const addItemDB = createAsyncThunk(
  'cart/addItemDB',
  async (id: number, { rejectWithValue }) => {
    await axios
      .post(CART_URL + id, { quantity: 1 }, { headers: authHeader() })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        const error: AxiosError<ValidationErrors> = err;
        if (!error.response) {
          throw err;
        }
        return rejectWithValue(error.response.data);
      });
  }
);

export interface CartItem {
  title: string;
  quantity: number;
  price: number;
  image: string;
  id?: number;
}

//type CartData = Pick<CartItem, 'id' | 'quantity'>;

export interface CartState {
  isOpen: boolean;
  items: CartItem[];
  quantity: number;
  price: number;
  loading: boolean;
  errors: [] | unknown;
}

const initialState: CartState = {
  isOpen: false,
  items: [],
  quantity: 0,
  price: 0,
  loading: false,
  errors: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
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
  extraReducers: (builder) => {
    builder.addCase(addItemDB.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(addItemDB.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(addItemDB.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      });
  },
});

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

export default cartSlice.reducer;
