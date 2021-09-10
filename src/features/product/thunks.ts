import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { fetchProducts, createProduct, removeProduct, updateProduct, searchProducts } from './api';
import { IProduct, ProductDto, UpdateProductDto } from './productSlice';

export const fetch = createAsyncThunk('product/fetchProducts', async () => {
  return fetchProducts();
});

export const add = createAsyncThunk(
  'product/addProducts',
  async (data: ProductDto, { rejectWithValue }) => {
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
  async (product: IProduct, { rejectWithValue }) => {
    try {
      removeProduct(product.id);
      return product;
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
  async (updateProps: UpdateProductDto, { rejectWithValue }) => {
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
