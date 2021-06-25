import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { ProductState } from './productSlice';

export const selectRoot = (state: RootState): ProductState => state.product;

export const selectItems = createSelector([selectRoot], (product: ProductState) => product.items);

export const selectSearch = createSelector([selectRoot], (product: ProductState) => product.search);

export const selectSearchItems = createSelector(
  [selectRoot],
  (product: ProductState) => product.searchItems
);
