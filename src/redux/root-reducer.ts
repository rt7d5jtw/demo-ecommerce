import { combineReducers } from 'redux';
import userReducer from './user/userSlice';
import productReducer from './product/productSlice';
import cartReducer from './cart/cartSlice';
import alertReducer from './alert/alertSlice';
import orderReducer from './order/orderSlice';
import categoryReducer from './category/categorySlice';
import promotionReducer from './promotions/promotionsSlice';
import { uiReducer } from './ui/ui.reducer';

export const rootReducer = combineReducers({
  user: userReducer,
  category: categoryReducer,
  order: orderReducer,
  product: productReducer,
  cart: cartReducer,
  alert: alertReducer,
  promotions: promotionReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
