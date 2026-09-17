import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/const';

import type { TOrder } from '@/services/order/slice';
import type { TIngredient } from '@utils/types';

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TPostOrdersPayload = {
  ingredients: string[];
};

export type TPostOrdersResponse = {
  name: string;
  order: TOrder;
  success: boolean;
};

export const burgerApi = createApi({
  reducerPath: 'burgerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => ({ url: '/ingredients' }),
      transformResponse: (response: TIngredientsResponse) => {
        if (!response.success) throw new Error('Ошибка запроса на сервер');
        return response.data;
      },
    }),
    postOrder: builder.mutation<TPostOrdersResponse, TPostOrdersPayload>({
      query: (body: TPostOrdersPayload) => ({
        method: 'POST',
        url: '/orders',
        body,
      }),
      transformResponse: (response: TPostOrdersResponse) => {
        if (!response.success) throw new Error('Ошибка создания заказа');
        return response;
      },
    }),
  }),
});

export const { useGetIngredientsQuery, usePostOrderMutation } = burgerApi;
