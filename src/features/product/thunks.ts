import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { fetchProducts, createProduct, removeProduct, updateProduct, searchProducts } from './api';
import { Product } from './productSlice';

export const fetch = createAsyncThunk('product/fetchProducts', async () => {
  return fetchProducts();
});

export const add = createAsyncThunk(
  'product/addProducts',
  async (data: Product, { rejectWithValue }) => {
    try {
      return createProduct(data);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const remove = createAsyncThunk(
  'product/removeProducts',
  async (id: number, { rejectWithValue }) => {
    try {
      return removeProduct(id);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const update = createAsyncThunk(
  'product/updateProducts',
  async (updateProps: Product, { rejectWithValue }) => {
    try {
      return updateProduct(updateProps);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const search = createAsyncThunk(
  'product/search',
  async (search: string, { rejectWithValue }) => {
    try {
      return searchProducts(search);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);
