import { createAction, createSlice } from '@reduxjs/toolkit';
import { ICartItem } from '../cart/cartSlice';
import { fetch, fetchAll, create, addItems, remove, createIntent, invoice } from './thunks';

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
//[ICartItem[], IOrder]
export interface OrderState {
  orders: IOrder[];
  recentOrder: IOrder | null;
  recentOrderItems: ICartItem[] | null;
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

export const takeCart = createAction<ICartItem[]>('order/takeCart');
export const clearRecentOrder = createAction('order/clearRecentOrder');

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    takeCart: (state, { payload }) => {
      state.recentOrderItems = payload;
    },
    clearRecentOrder: (state) => {
      state.recentOrder = null;
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
      }),
      builder.addCase(invoice.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(invoice.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.invoice = payload;
      }),
      builder.addCase(invoice.rejected, (state, { payload }) => {
        state.loading = false;
        state.errors = payload;
      });
  },
});

export default orderSlice.reducer;
