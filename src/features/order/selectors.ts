import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { OrderState } from './orderSlice';

export const selectOrder = (state: RootState): OrderState => state.order;

export const selectOrders = createSelector([selectOrder], (order: OrderState) => order.orders);

export const selectRecentOrder = createSelector(
  [selectOrder],
  (order: OrderState) => order.recentOrder
);

export const selectRecentOrderItems = createSelector(
  [selectOrder],
  (order: OrderState) => order.recentOrderItems
);
