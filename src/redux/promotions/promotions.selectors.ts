import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectState = (state: RootState) => state.promotions;

export const selectPromotions = createSelector(
  [selectState],
  (promotions: any) => promotions.promotions
);
