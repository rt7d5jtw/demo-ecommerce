import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotion/promotionSlice';
import { RootState } from '../../app/store';

export const PRODUCT_URL = 'http://localhost:3000/product';

export const fetch = createAsyncThunk('product/fetchProducts', async () => {
  const { data } = await axios.get(PRODUCT_URL);
  return data;
});

export const add = createAsyncThunk(
  'product/addProducts',
  async (data: Product, { rejectWithValue }) => {
    try {
      const response = await axios.post(PRODUCT_URL, data);
      return response.data;
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const remove = createAsyncThunk(
  'product/removeProducts',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(PRODUCT_URL.concat('/' + id));
      return id;
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const update = createAsyncThunk(
  'product/updateProducts',
  async ({ id, ...updateProps }: Product, { rejectWithValue }) => {
    try {
      const response = await axios.patch(PRODUCT_URL.concat('/' + id), { ...updateProps });
      return response.data;
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const search = createAsyncThunk('product/search', async (search: string) => {
  const { data } = await axios.get(PRODUCT_URL.concat('?search=' + search));
  return { search, data };
});

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

export type ProductOptional = Partial<Product>;

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

export const selectRoot = (state: RootState): ProductState => state.product;

export const selectItems = createSelector([selectRoot], (product: ProductState) => product.items);

export const selectSearch = createSelector([selectRoot], (product: ProductState) => product.search);

export const selectSearchItems = createSelector(
  [selectRoot],
  (product: ProductState) => product.searchItems
);

export default productSlice.reducer;
