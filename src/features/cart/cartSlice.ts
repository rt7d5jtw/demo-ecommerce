import { createSlice, createAction } from '@reduxjs/toolkit';
import { fetchCartState, addItemDB, removeItemDB, clearCartDB } from './thunks';
import { addItemToCart, removeItemFromCart } from './selectors';

export interface ICart {
  userId: string;
  id: string;
  createdAt: string;
}

export interface CartItemDto {
  title: string;
  quantity: number;
  price: number;
  image: string;
  id: string;
}

export interface ICartItem extends CartItemDto {
  productId: number;
  cartId: string;
  CreatedAt: string;
}

export interface CartInfoDto extends CartItemDto {
  cartId: string;
  productId: string;
}

export interface CartState {
  isOpen: boolean;
  items: CartItemDto[];
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

export const clearCart = createAction('cart/clearCart');
export const cartToggle = createAction<boolean>('cart/cartToggle');
export const addItem = createAction<CartItemDto>('cart/addItem');
export const removeItem = createAction<CartItemDto>('cart/removeItem');

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
    builder.addCase(fetchCartState.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetchCartState.fulfilled, (state, { payload }) => {
        state.items = payload;
        state.quantity = payload.reduce((acc: number, curr: CartItemDto) => acc + curr.quantity, 0);
        state.loading = false;
      }),
      builder.addCase(fetchCartState.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      }),
      builder.addCase(addItemDB.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(addItemDB.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(addItemDB.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      }),
      builder.addCase(removeItemDB.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(removeItemDB.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(removeItemDB.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      }),
      builder.addCase(clearCartDB.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(clearCartDB.fulfilled, (state) => {
        state.items = [];
        state.quantity = 0;
        state.loading = false;
      }),
      builder.addCase(clearCartDB.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
