import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { OrderState } from '../types';

const selectOrder = (state: RootState) => state.order;

export const selectOrders = createSelector([selectOrder], (order: OrderState) => order.orders);
