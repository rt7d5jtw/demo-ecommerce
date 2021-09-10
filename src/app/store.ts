import { persistStore } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import userReducer from '../features/user/userSlice';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';
import alertReducer from '../features/alert/alertSlice';
import orderReducer from '../features/order/orderSlice';
import categoryReducer from '../features/category/categorySlice';
import promotionReducer from '../features/promotion/promotionSlice';

export const persistConfig = {
  key: 'root',
  version: 1,
  storage: storage,
  blacklist: ['alert', 'user'],
};

const userPersistConfig = {
  key: 'user',
  storage: storage,
  blacklist: ['errors'],
};

const middlewares = [logger, thunk];

export const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  category: categoryReducer,
  order: orderReducer,
  product: productReducer,
  cart: cartReducer,
  alert: alertReducer,
  promotion: promotionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [...middlewares],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
