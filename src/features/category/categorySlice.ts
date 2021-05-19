import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../../app/store';
import { Category, CategoryState } from '../../app/types';

export const CATEGORY_URL = 'http://localhost:3000/category/';

export const fetch = createAsyncThunk(
  'category/fetch',
  async (): Promise<Category[]> => {
    const { data } = await axios.get(CATEGORY_URL);
    return data;
  }
);

export const add = createAsyncThunk(
  'category/add',
  async (cname: string): Promise<Category> => {
    const { data } = await axios.post(CATEGORY_URL, { cname: cname });
    return data;
  }
);

export const remove = createAsyncThunk(
  'category/remove',
  async (id: string): Promise<void> => {
    return axios.delete(CATEGORY_URL + id);
  }
);

export const update = createAsyncThunk(
  'category/update',
  async (data: Category): Promise<Category> => {
    const { id, cname } = data;
    const response = await axios.patch(CATEGORY_URL + id, cname);
    return response.data;
  }
);

interface initialState {
  categories: Category[];
  loading: boolean;
}

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetch.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetch.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      }),
      builder.addCase(fetch.rejected, (state, action) => {
        state.loading = false;
      }),
      builder.addCase(add.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(add.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      }),
      builder.addCase(add.rejected, (state, action) => {
        state.loading = false;
      }),
      builder.addCase(remove.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(remove.fulfilled, (state, action) => {
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state, action) => {
        state.loading = false;
      }),
      builder.addCase(update.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(update.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      }),
      builder.addCase(update.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const selectRoot = (state: RootState) => state.category;

export const selectCategories = createSelector(
  [selectRoot],
  (category: CategoryState) => category.categories
);

export default categorySlice.reducer;
