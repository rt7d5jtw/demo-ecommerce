import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCartInfo, addItemToCartDB, removeItemFromCartDB, clearCartState } from './api';

export const fetchCartState = createAsyncThunk('cart/fetch', async () => {
  return fetchCartInfo();
});

export const addItemDB = createAsyncThunk('cart/addItemDB', async (id: number) => {
  return addItemToCartDB(id);
});

export const removeItemDB = createAsyncThunk('cart/removeItemDB', async (id: number) => {
  return removeItemFromCartDB(id);
});

export const clearCartDB = createAsyncThunk(
  'cart/clearCartDB',
  async (): Promise<void> => {
    return clearCartState();
  }
);
