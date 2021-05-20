import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import axios from 'axios';
import { RootState } from '../../app/store';

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

export interface Category {
  cname: string;
  id: string;
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  errors: unknown;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  errors: [],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState: initialState,
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
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(add.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(add.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.loading = false;
      }),
      builder.addCase(add.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(remove.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(remove.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(update.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(update.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(update.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      });
  },
});

export const selectRoot = (state: RootState): CategoryState => state.category;

export const selectCategories = createSelector(
  [selectRoot],
  (category: CategoryState) => category.categories
);

export default categorySlice.reducer;
