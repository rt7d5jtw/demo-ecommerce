import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { CategoryState } from '../types';

const selectCategory = (state: RootState) => state.category;

export const selectCategories = createSelector(
  [selectCategory],
  (category: CategoryState) => category.categories
);
