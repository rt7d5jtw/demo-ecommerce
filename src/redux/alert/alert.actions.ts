import { AlertConstants } from './alert.constants';

export const productAdded = () => ({
  type: AlertConstants.PRODUCT_ADDED
})

export const productDeleted = () => ({
  type: AlertConstants.PRODUCT_DELETED
})

export const cartCleared = () => ({
  type: AlertConstants.CART_CLEARED
})

export const userLogged = () => ({
  type: AlertConstants.LOGGED_IN
})

export const userRegistered = () => ({
  type: AlertConstants.REGISTERED
})

export const hideout = () => ({
  type: AlertConstants.HIDEOUT
})
