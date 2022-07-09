import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { IProductState } from './productSlice';

export const selectRoot = (state: RootState): IProductState => state.product;

export const selectItems = createSelector(
  [selectRoot],
  (product: IProductState) => product.items
);

export const selectSearch = createSelector(
  [selectRoot],
  (product: IProductState) => product.search
);

export const selectSearchItems = createSelector(
  [selectRoot],
  (product: IProductState) => product.searchItems
);
