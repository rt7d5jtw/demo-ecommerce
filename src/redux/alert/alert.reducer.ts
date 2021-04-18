import { AnyAction } from 'redux';
import { AlertConstants } from './alert.constants';

export enum alert_type {
  success = 'success',
  warning = 'warning',
  error = 'error',
  nostate = ''
}

/* message is the displayed message,
 * atype is alert type definfed in enum
 * timeout defines time the alert is showed */
const INITIAL_STATE = {
  message: '',
  atype: alert_type.nostate,
  timeout: 5000
}

export const alertReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case AlertConstants.PRODUCT_ADDED:
      return {
        ...state,
        message: 'Product added to cart',
        atype: alert_type.success
      }

    case AlertConstants.PRODUCT_DELETED:
      return {
        ...state,
        message: 'Product deleted from the cart',
        atype: alert_type.success
      }

    case AlertConstants.CART_CLEARED:
      return {
        ...state,
        message: 'Cart cleared of all products',
        atype: alert_type.success
      }

    case AlertConstants.LOGGED_IN:
      return {
        ...state,
        message: 'User logged in',
        atype: alert_type.success
      }

    case AlertConstants.REGISTERED:
      return {
        ...state,
        message: 'User registered succesfully',
        atype: alert_type.success
      }

    case AlertConstants.HIDEOUT:
      return {
        ...state,
        message: '',
        atype: alert_type.nostate
      }

    default:
      return state;
  }
}
