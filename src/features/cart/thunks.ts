import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { fetchCartInfo, addItemToCartDB, removeItemFromCartDB, clearCartState } from './api';

export const fetchCartState = createAsyncThunk('cart/fetch', async () => {
  return fetchCartInfo();
});

export const addItemDB = createAsyncThunk(
  'cart/addItemDB',
  async (id: number, { rejectWithValue }) => {
    try {
      return addItemToCartDB(id);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeItemDB = createAsyncThunk(
  'cart/removeItemDB',
  async (id: number, { rejectWithValue }) => {
    try {
      return removeItemFromCartDB(id);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const clearCartDB = createAsyncThunk('cart/clearCartDB', async () => {
  return clearCartState();
});
