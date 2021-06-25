import { createAsyncThunk } from '@reduxjs/toolkit';
import { createCategory, fetchCategories, removeCategory, updateCategory } from './api';
import { Category } from './categorySlice';

export const fetch = createAsyncThunk(
  'category/fetch',
  async (): Promise<Category[]> => {
    return fetchCategories();
  }
);

export const add = createAsyncThunk(
  'category/add',
  async (cname: string): Promise<Category> => {
    return createCategory(cname);
  }
);

export const remove = createAsyncThunk(
  'category/remove',
  async (id: string): Promise<void> => {
    return removeCategory(id);
  }
);

export const update = createAsyncThunk(
  'category/update',
  async (data: Category): Promise<Category> => {
    return updateCategory(data);
  }
);
