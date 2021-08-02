import { createAction, createSlice } from '@reduxjs/toolkit';
import { ICartItem } from '../cart/cartSlice';
import { fetch, fetchAll, create, fetchItems, remove, createIntent } from './thunks';

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

export interface IOrder {
  total_price: number;
  address: string;
  country: string;
  city: string;
  postalcode: string;
  status: OrderStatus;
  date: string;
  id: string;
  userId: string;
}

export type OrderDTO = Omit<IOrder, 'date' | 'id' | 'userId'>;

export type UpdateOrderDto = Partial<OrderDTO>;

export interface IOrderItem {
  orderId: string;
  price: number;
  image: string;
  title: string;
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
  orders: IOrder[];
  recentOrder: IOrder | null;
  recentOrderItems: IOrderItem[] | null;
  invoice: any;
  loading: boolean;
  errors: unknown;
}

const initialState: OrderState = {
  orders: [],
  recentOrder: null,
  recentOrderItems: null,
  invoice: null,
  loading: false,
  errors: [],
};

export const clearRecentOrder = createAction('order/clearRecentOrder');

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    clearRecentOrder: (state) => {
      state.recentOrder = null;
      state.recentOrderItems = null;
    },
  },
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
        state.recentOrder = action.payload;
        state.loading = false;
      }),
      builder.addCase(create.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(createIntent.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(createIntent.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(createIntent.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(fetchItems.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(fetchItems.fulfilled, (state, { payload }) => {
        state.recentOrderItems = payload;
        state.loading = false;
      }),
      builder.addCase(fetchItems.rejected, (state, { payload }) => {
        state.errors = payload;
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
