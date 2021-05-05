import { AnyAction } from 'redux';
import { addItemToCart, removeItemFromCart } from './cart.actions';
import { CartConstants } from './cart.constants';

const INITIAL_STATE = {
  isOpen: false,
  cartItems: [],
  quantity: 0,
  price: 0,
};

export const cartReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case CartConstants.CART_TOGGLE:
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case CartConstants.ADD_ITEM:
      return {
        ...state,
        cartItems: addItemToCart(state.cartItems, action.payload),
        quantity: state.quantity + 1,
        price: state.price,
      };

    case CartConstants.REMOVE_ITEM:
      return {
        ...state,
        cartItems: removeItemFromCart(state.cartItems, action.payload),
        quantity: state.quantity - 1,
      };

    case CartConstants.CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        quantity: 0,
      };

    default:
      return state;
  }
};
