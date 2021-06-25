import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetch, fetchAll, add, addItems, remove, createIntent } from './thunks';

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
  postalcode: number | null;
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
      builder.addCase(add.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(add.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.loading = false;
      }),
      builder.addCase(add.rejected, (state, action) => {
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

export const selectOrder = (state: RootState): OrderState => state.order;

export const selectOrders = createSelector([selectOrder], (order: OrderState) => order.orders);

export default orderSlice.reducer;
