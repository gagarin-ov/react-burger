import { authApi } from '@api/auth-api';
import { burgerApi } from '@api/burger-api';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { burgerConstructorSlice } from './burger-constructor/slice';
import { orderSlice } from './order/slice';
import { userSlice } from './user/slice';

const rootReducer = combineSlices(
  burgerApi,
  authApi,
  burgerConstructorSlice,
  userSlice,
  orderSlice
);

export type TState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) => {
    // Подключаем через middleware
    return getDefaultMiddleware()
      .concat(burgerApi.middleware)
      .concat(authApi.middleware);
  },
});

export type TAppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<TAppDispatch>();
export const useAppSelector = useSelector.withTypes<TState>();
