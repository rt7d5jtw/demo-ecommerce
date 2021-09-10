import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { createCategory, fetchCategories, removeCategory, updateCategory } from './api';
import { ICategory } from './categorySlice';

export const fetch = createAsyncThunk(
  'category/fetch',
  async (): Promise<ICategory[]> => {
    return fetchCategories();
  }
);

export const create = createAsyncThunk(
  'category/create',
  async (cname: string, { rejectWithValue }) => {
    try {
      return createCategory(cname);
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
  'category/remove',
  async (category: ICategory, { rejectWithValue }) => {
    try {
      removeCategory(category.id);
      return category;
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
  'category/update',
  async (data: ICategory, { rejectWithValue }) => {
    try {
      return updateCategory(data);
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);
