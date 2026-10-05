import { burgerApi } from '@api/burger-api.ts';
import {
  combineSlices,
  configureStore as createStore,
  type EnhancedStore,
} from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor/slice';
import { ingredientDetailsSlice } from './ingredient-details/slice';
import { orderSlice } from './order/slice';

const rootReducer = combineSlices(
  burgerApi,
  burgerConstructorSlice,
  ingredientDetailsSlice,
  orderSlice
);

export type TState = ReturnType<typeof rootReducer>;

export const configureStore = (
  initialState?: Partial<TState>
): EnhancedStore<TState> => {
  return createStore({
    reducer: rootReducer,
    preloadedState: initialState,
    devTools: import.meta.env.DEV,
    middleware: (getDefaultMiddleware) => {
      // Подключаем через middleware
      return getDefaultMiddleware().concat(burgerApi.middleware);
    },
  });
};
