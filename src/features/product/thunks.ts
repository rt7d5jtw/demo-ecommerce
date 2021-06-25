import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, createProduct, removeProduct, updateProduct, searchProducts } from './api';
import { Product } from './productSlice';

export const fetch = createAsyncThunk('product/fetchProducts', async () => {
  return fetchProducts();
});

export const add = createAsyncThunk('product/addProducts', async (data: Product) => {
  return createProduct(data);
});

export const remove = createAsyncThunk('product/removeProducts', async (id: number) => {
  return removeProduct(id);
});

export const update = createAsyncThunk('product/updateProducts', async (updateProps: Product) => {
  return updateProduct(updateProps);
});

export const search = createAsyncThunk('product/search', async (search: string) => {
  return searchProducts(search);
});
