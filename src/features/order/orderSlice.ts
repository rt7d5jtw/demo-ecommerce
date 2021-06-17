import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { authHeader } from '../user/userSlice';
import { RootState } from '../../app/store';

export const ORDER_URL = 'http://localhost:3000/orders/';

// this gets user's orders
export const fetch = createAsyncThunk(
  'order/fetch',
  async (): Promise<Order[]> => {
    const { data } = await axios.get(ORDER_URL, { headers: authHeader() });
    return data;
  }
);

export const fetchAll = createAsyncThunk(
  'order/fetchAll',
  async (): Promise<Order[]> => {
    const { data } = await axios.get(ORDER_URL + 'all', { headers: authHeader() });
    return data;
  }
);

export const add = createAsyncThunk(
  'order/add',
  async (data: OrderDTO): Promise<OrderDTO> => {
    const response = await axios.post(ORDER_URL, data, { headers: authHeader() });
    return response.data;
  }
);

export const addItems = createAsyncThunk(
  'order/addItems',
  async (data: OrderItem[]): Promise<OrderItem[]> => {
    const response = await axios.post(ORDER_URL + 'items', data, { headers: authHeader() });
    return response.data;
  }
);

/* calls api to create a payment intent */
export const createIntent = createAsyncThunk(
  'order/createIntent',
  async (req: any): Promise<any> => {
    const { data } = await axios.post(ORDER_URL + 'create-payment-intent', req, {
      headers: authHeader(),
    });
    // returns client secret
    return data;
  }
);

export const remove = createAsyncThunk(
  'order/remove',
  async (id: string): Promise<void> => {
    axios.delete(ORDER_URL + id);
  }
);

export enum OrderStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
}

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
