import { createSlice } from '@reduxjs/toolkit';
import { fetch, fetchAll, create, addItems, remove, createIntent } from './thunks';

export enum OrderStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
}

export type PaymentIntentDTO = {
  amount: number;
  currency: string;
  payment_method_types: string;
};

export interface Order {
  total_price: number;
  address: string;
  country: string;
  city: string;
  postalcode: string;
  status: OrderStatus;
  date?: string;
  id?: string;
  userId?: string;
}

export type OrderDTO = Omit<Order, 'date' | 'id' | 'userId'>;

export interface OrderItem {
  orderId: string;
  price: number;
  quantity: number;
  productId: number;
}

export interface OrderItemDto {
  id: string;
  cartId: string;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  errors: unknown;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  errors: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetch.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetch.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      }),
      builder.addCase(fetch.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(fetchAll.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      }),
      builder.addCase(fetchAll.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(create.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(create.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.loading = false;
      }),
      builder.addCase(create.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(addItems.pending, (state) => {
        state.loading = false;
      }),
      builder.addCase(addItems.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(addItems.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(createIntent.pending, (state) => {
        state.loading = false;
      }),
      builder.addCase(createIntent.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(createIntent.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(remove.pending, (state) => {
        state.loading = false;
      }),
      builder.addCase(remove.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
