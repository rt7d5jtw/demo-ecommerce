import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PromotionsState, _Promotions } from '../types';
import axios, { AxiosError } from 'axios';
import { RootState } from '../root-reducer';

const PROMOTION_URL = 'http://localhost:3000/promotions';

export interface ValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

export const fetchPromotions = createAsyncThunk('promotions/fetchPromotions', async () => {
  const { data } = await axios.get(PROMOTION_URL);
  return data;
});

export const add = createAsyncThunk(
  'promotions/addPromotions',
  async (data: _Promotions, { rejectWithValue }) => {
    try {
      const response = await axios.post(PROMOTION_URL, data);
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
  'promotions/removePromotions',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(PROMOTION_URL.concat('/' + id));
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

type UpdateValues = {
  title: string;
  image: string;
  link: string;
  id: number;
};

export const update = createAsyncThunk(
  'promotions/updatePromotions',
  async ({ id, ...updateProps }: UpdateValues, { rejectWithValue }) => {
    try {
      const response = await axios.patch(PROMOTION_URL.concat('/' + id), { ...updateProps });
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

export const promotionsSlice = createSlice({
  name: 'promotions',
  initialState: {
    items: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPromotions.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetchPromotions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      }),
      builder.addCase(fetchPromotions.rejected, (state, action) => {
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
        state.items;
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state, action) => {
        state.loading = false;
      });
    builder.addCase(update.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(update.fulfilled, (state, action) => {
        state.items;
        state.loading = false;
      }),
      builder.addCase(update.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const selectPromotions = ({ promotions }: any) => promotions.items;

export const checkIfLoading = (state: RootState) => state.promotions.loading;

//export const {} = promotionsSlice.actions;

export default promotionsSlice.reducer;
