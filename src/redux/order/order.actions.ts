import { OrderConstants } from './order.constants';
import { AppDispatch } from '../store';
import { getAllOrders, getOrders } from '../../services/order.service';

/* side effects */

export function fetchOrders() {
  return async (dispatch: AppDispatch) => {
    return getOrders().then(orders => {
      dispatch({
        type: OrderConstants.FETCH_ORDERS,
        payload: orders.data
      })
    })
  }
}

export function fetchAllOrders() {
  return async (dispatch: AppDispatch) => {
    return getAllOrders().then(orders => {
      dispatch({
        type: OrderConstants.FETCH_ALL_ORDERS,
        payload: orders.data
      })
    })
  }
}

export const orderAdded = () => ({
  type: OrderConstants.ORDER_ADDED
})

export const orderDeleted = () => ({
  type: OrderConstants.ORDER_DELETED
})
