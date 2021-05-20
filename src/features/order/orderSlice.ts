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
  async (data: Order): Promise<Order> => {
    const response = await axios.post(ORDER_URL, data);
    return response.data;
  }
);

export const remove = createAsyncThunk(
  'order/remove',
  async (id: string): Promise<void> => {
    axios.delete(ORDER_URL + id);
  }
);

export interface Order {
  address: string;
  date: string;
  id: string;
  status: string;
  total_price: number;
  userId: string;
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
