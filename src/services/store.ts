import { configureStore } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import feedsReducer from './slices/feedSlices';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = {
  ingredients: ingredientsReducer,
  user: userReducer,
  feeds: feedsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer
};
// Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = {
  ingredients: ReturnType<typeof ingredientsReducer>;
  user: ReturnType<typeof userReducer>;
  feeds: ReturnType<typeof feedsReducer>;
  burgerConstructor: ReturnType<typeof constructorReducer>;
  order: ReturnType<typeof orderReducer>;
};

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
