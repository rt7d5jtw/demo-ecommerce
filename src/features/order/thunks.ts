import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchOrders,
  fetchAllOrders,
  createOrder,
  addOrderItems,
  removeOrder,
  stripeCreateIntent,
} from './api';
import { Order, OrderDTO, OrderItem, PaymentIntentDTO } from './orderSlice';

// this gets user's orders
export const fetch = createAsyncThunk(
  'order/fetch',
  async (): Promise<Order[]> => {
    return fetchOrders();
  }
);

export const fetchAll = createAsyncThunk(
  'order/fetchAll',
  async (): Promise<Order[]> => {
    return fetchAllOrders();
  }
);

export const add = createAsyncThunk(
  'order/add',
  async (data: OrderDTO): Promise<OrderDTO> => {
    return createOrder(data);
  }
);

export const addItems = createAsyncThunk(
  'order/addItems',
  async (data: OrderItem[]): Promise<OrderItem[]> => {
    return addOrderItems(data);
  }
);

export const remove = createAsyncThunk(
  'order/remove',
  async (id: string): Promise<void> => {
    return removeOrder(id);
  }
);

/* calls api to create a payment intent */
export const createIntent = createAsyncThunk(
  'order/createIntent',
  async (req: PaymentIntentDTO): Promise<PaymentIntentDTO> => {
    return stripeCreateIntent(req);
  }
);
