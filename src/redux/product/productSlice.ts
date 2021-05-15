import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ValidationErrors } from '../promotions/promotionsSlice';
import { RootState } from '../root-reducer';
import { ProductwithID } from '../types';

export const PRODUCT_URL = 'http://localhost:3000/product';

export const fetch = createAsyncThunk('product/fetchProducts', async () => {
  const { data } = await axios.get(PRODUCT_URL);
  return data;
});

export const add = createAsyncThunk(
  'product/addProducts',
  async (data: ProductwithID, { rejectWithValue }) => {
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
      const response = await axios.delete(PRODUCT_URL.concat('/' + id));
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
  async ({ id, ...updateProps }: ProductwithID, { rejectWithValue }) => {
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

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    searchItems: [],
    search: '',
    loading: false,
    error: null,
  },
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
        state.loading = false;
      }),
      builder.addCase(remove.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(remove.fulfilled, (state, action) => {
        state.items.filter((e) => e.id !== action.payload);
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state, action) => {
        state.loading = false;
      }),
      builder.addCase(update.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(update.fulfilled, (state, action) => {
        state.items;
        state.loading = false;
      }),
      builder.addCase(update.rejected, (state, action) => {
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
        state.loading = false;
      });
  },
});

export const selectProductItems = (state: RootState) => state.product.items;
export const selectProductSearch = (state: RootState) => state.product.search;
export const selectSearchItems = (state: RootState) => state.product.searchItems;

export default productSlice.reducer;
