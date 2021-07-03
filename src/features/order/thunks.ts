import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
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

export const create = createAsyncThunk(
  'order/create',
  async (data: OrderDTO, { rejectWithValue }) => {
    try {
      return createOrder(data);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const addItems = createAsyncThunk(
  'order/addItems',
  async (id: string, { rejectWithValue }) => {
    try {
      return addOrderItems(id);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const remove = createAsyncThunk('order/remove', async (id: string, { rejectWithValue }) => {
  try {
    return removeOrder(id);
  } catch (err) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

/* calls api to create a payment intent */
export const createIntent = createAsyncThunk(
  'order/createIntent',
  async (req: PaymentIntentDTO, { rejectWithValue }) => {
    try {
      return stripeCreateIntent(req);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);
