import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { fetch, create, remove, update } from './thunks';

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
      builder.addCase(create.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(create.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.loading = false;
      }),
      builder.addCase(create.rejected, (state, action) => {
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
