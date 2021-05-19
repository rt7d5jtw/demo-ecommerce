import { persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './root-reducer';

export const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['alert'],
};

const middlewares = [logger, thunk];

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: any = configureStore({
  reducer: persistedReducer,
  middleware: [...middlewares],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
