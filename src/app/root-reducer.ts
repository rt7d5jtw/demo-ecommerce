import { combineReducers } from 'redux';
import userReducer from '../features/user/userSlice';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';
import alertReducer from '../features/alert/alertSlice';
import orderReducer from '../features/order/orderSlice';
import categoryReducer from '../features/category/categorySlice';
import promotionReducer from '../features/promotion/promotionSlice';

export const rootReducer = combineReducers({
  user: userReducer,
  category: categoryReducer,
  order: orderReducer,
  product: productReducer,
  cart: cartReducer,
  alert: alertReducer,
  promotion: promotionReducer,
});
