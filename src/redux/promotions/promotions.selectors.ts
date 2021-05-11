import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { PromotionsState } from '../types';

const selectState = (state: RootState) => state.promotions;

export const selectPromotions = createSelector(
  [selectState],
  (promotions: any) => promotions.promotions
);

export const SelectTest = createSelector([selectState], (promotions: any) => promotions.test);

export const selectLoading = createSelector(
  [selectState],
  (promotions: PromotionsState) => promotions.loading
);
