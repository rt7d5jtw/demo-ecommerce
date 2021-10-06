import { createAction, createSlice } from '@reduxjs/toolkit';
import { CategoryDTO, ICategory } from '../category/categorySlice';
import { fetch, add, remove, update, search } from './thunks';
import { removeFromState, updateState } from '../shared/utils';

export interface IProduct {
  id: number;
  title: string;
  quantity: number;
  image: string;
  price: number;
  description: string;
  categories: ICategory[];
  status: string;
}

export type ProductDto = {
  title: string;
  image: string;
  price: string;
  description: string;
  categoryIds: CategoryDTO[];
};

type PartialProduct = Partial<ProductDto>;

export interface UpdateProductDto extends PartialProduct {
  id: number;
  status?: string;
}

export type IProductCard = Omit<IProduct, 'updatedAt' | 'createdAt' | 'status'>;

export interface IProductState {
  items: IProduct[];
  search: string;
  searchItems: IProduct[];
  loading: boolean;
  errors: null | unknown;
}

const initialState: IProductState = {
  items: [],
  searchItems: [],
  search: '',
  loading: false,
  errors: null,
};

export const clearProducts = createAction('product/clearProducts');

/* GUEST functions */

export interface GUESTProductDto extends ProductDto {
  id: number;
}

export const addProductsGUEST = createAction<GUESTProductDto>('product/addProductsGUEST');
export const removeProductsGUEST = createAction<IProduct>('product/addProductsGUEST');
export const updateProductsGUEST = createAction<UpdateProductDto>('product/addProductsGUEST');

export const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = [];
    },
    addProductsGUEST: (state, { payload }) => {
      state.items = [...state.items, payload];
    },
    removeProductsGUEST: (state, { payload }) => {
      state.items = removeFromState(payload, state.items);
    },
    updateProductsGUEST: (state, { payload }) => {
      state.items = updateState(payload, state.items);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetch.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetch.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      }),
      builder.addCase(fetch.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(add.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(add.fulfilled, (state, { payload }) => {
        state.items.push(payload);
        state.loading = false;
      }),
      builder.addCase(add.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      }),
      builder.addCase(remove.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(remove.fulfilled, (state, { payload }) => {
        state.items = removeFromState(payload, state.items);
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      }),
      builder.addCase(update.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(update.fulfilled, (state, { payload }) => {
        state.items = updateState(payload, state.items);
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
