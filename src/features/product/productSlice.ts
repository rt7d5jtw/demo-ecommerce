import { createSlice } from '@reduxjs/toolkit';
import { fetch, add, remove, update, search } from './thunks';

export interface Product {
  id: number;
  category: string;
  title: string;
  quantity: number;
  image: string;
  price: number;
  author: string;
  description: string;
  categoryId?: string;
}

export type CreateProductDto = Omit<Product, 'id' | 'category' | 'quantity'>;

export type UpdateProductDto = Partial<Product>;

export interface ProductState {
  items: Product[];
  search: string;
  searchItems: Product[];
  loading: boolean;
  errors: null | unknown;
}

const initialState: ProductState = {
  items: [],
  searchItems: [],
  search: '',
  loading: false,
  errors: null,
};

export const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetch.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetch.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      }),
      builder.addCase(fetch.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(add.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(add.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      }),
      builder.addCase(add.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(remove.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(remove.fulfilled, (state, action) => {
        state.items.filter((e) => e.id !== action.payload);
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state) => {
        state.loading = false;
      }),
      builder.addCase(update.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(update.fulfilled, (state) => {
        state.items;
        state.loading = false;
      }),
      builder.addCase(update.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(search.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(search.fulfilled, (state, action) => {
        state.searchItems = action.payload.data;
        state.search = action.payload.search;
        state.loading = false;
      }),
      builder.addCase(search.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
