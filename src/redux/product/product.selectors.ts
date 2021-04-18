import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { ProductState } from '../types';

const selectProduct = (state: RootState) => state.product;

export const selectProductItems = createSelector(
  [selectProduct],
  (product: ProductState) => product.items
)

export const selectProductSearch = createSelector(
  [selectProduct],
  (product: ProductState) => product.search
)

export const selectSearchItems = createSelector(
  [selectProduct],
  (product: ProductState) => product.searchItems
)
