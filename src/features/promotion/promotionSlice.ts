import { createAction, createSlice } from '@reduxjs/toolkit';
import { removeFromState, updateState } from '../shared/utils';
import { fetch, create, remove, update } from './thunks';

export interface ValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

export interface IPromotions {
  id: number;
  image: string;
  title: string;
  url: string;
}

export type CreatePromotionDto = Omit<IPromotions, 'id'>;

export interface IPromotionsCard extends IPromotions {
  length: number;
}

export interface PromotionState {
  items: IPromotions[];
  loading: boolean;
  errors: [] | unknown;
}

const initialState: PromotionState = {
  items: [],
  loading: false,
  errors: [],
};

export const clearPromotions = createAction('promotion/clearPromotions');

export const promotionSlice = createSlice({
  name: 'promotion',
  initialState: initialState,
  reducers: {
    clearPromotions: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetch.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetch.fulfilled, (state, action) => {
        state.items = action.payload;
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
        state.items.push(action.payload);
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
        state.items = removeFromState(payload, state.items);
        state.loading = false;
      }),
      builder.addCase(remove.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      });
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
      });
  },
});

export default promotionSlice.reducer;
