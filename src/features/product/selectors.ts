import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { IProductState } from './productSlice';

export const selectRoot = (state: RootState): IProductState => state.product;

export const selectItems = createSelector([selectRoot], (product: IProductState) => product.items);

export const selectSearch = createSelector(
  [selectRoot],
  (product: IProductState) => product.search
);

export const selectSearchItems = createSelector(
  [selectRoot],
  (product: IProductState) => product.searchItems
);

/* utility functions */

export function updateState<T extends { id: number | string }>(newItem: T, state: T[]): T[] {
  const id = state.findIndex(({ id }) => id === newItem.id);
  state[id] = newItem;
  return state;
}

export function removeFromState<T extends { id: number | string }>(removable: T, state: T[]): T[] {
  return (state = state.filter(({ id }) => id !== removable.id));
}
