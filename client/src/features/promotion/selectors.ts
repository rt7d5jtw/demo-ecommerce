import { RootState } from '../../app/store';
import { createSelector } from 'reselect';
import { PromotionState } from './promotionSlice';

const selectPromotion = (state: RootState) => state.promotion;

export const selectPromotionItems = createSelector(
  [selectPromotion],
  (promotion: PromotionState) => promotion.items
);

export const checkIfLoading = createSelector(
  [selectPromotion],
  (promotion: PromotionState) => promotion.loading
);
