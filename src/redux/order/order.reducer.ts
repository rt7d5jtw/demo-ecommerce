import { AnyAction } from 'redux';
import { OrderConstants } from './order.constants';
import { Order } from '../types';

const INITIAL_STATE = {
  orders: [],
}

export const orderReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case OrderConstants.FETCH_ORDERS:
      return {
        ...state,
        orders: action.payload
      }

    case OrderConstants.FETCH_ALL_ORDERS:
      return {
        ...state,
        orders: action.payload
      }

    case OrderConstants.ORDER_ADDED:
      return {
        ...state,
        orders: action.payload
      }

    case OrderConstants.ORDER_DELETED:
      return {
        ...state,
        orders: action.payload
      }

    default:
      return state;
  }
}
