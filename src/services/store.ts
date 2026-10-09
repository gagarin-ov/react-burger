import { authApi } from '@api/auth-api';
import { burgerApi } from '@api/burger-api';
import {
  combineSlices,
  configureStore as createStore,
  type EnhancedStore,
  type ThunkDispatch,
  type UnknownAction,
} from '@reduxjs/toolkit';

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
export type TAppDispatch = ThunkDispatch<TState, unknown, UnknownAction>;

export const configureStore = (
  initialState?: Partial<TState>
): EnhancedStore<TState> => {
  return createStore({
    reducer: rootReducer,
    preloadedState: initialState,
    devTools: import.meta.env.DEV,
    middleware: (getDefaultMiddleware) => {
      // Подключаем через middleware
      return getDefaultMiddleware()
        .concat(burgerApi.middleware)
        .concat(authApi.middleware);
    },
  });
};
