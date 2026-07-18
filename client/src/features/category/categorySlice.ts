import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { removeFromState, updateState } from '../shared/utils';
import { fetch, create, remove, update } from './thunks';

export interface ICategory {
  cname: string;
  id: string;
}

export type CategoryDTO = Pick<ICategory, 'id'>;

export interface ICategoryState {
  categories: ICategory[];
  loading: boolean;
  errors: unknown;
}

const initialState: ICategoryState = {
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
      builder.addCase(remove.fulfilled, (state, { payload }) => {
        state.categories = removeFromState(payload, state.categories);
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(update.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(update.fulfilled, (state, { payload }) => {
        state.categories = updateState(payload, state.categories);
        state.loading = false;
      }),
      builder.addCase(update.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      });
  },
});

export const selectRoot = (state: RootState): ICategoryState => state.category;

export const selectCategories = createSelector(
  [selectRoot],
  (category: ICategoryState) => category.categories
);

export default categorySlice.reducer;
