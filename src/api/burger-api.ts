import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithRefresh } from '@utils/api';

import type { TOrder } from '@services/order/slice';
import type { TFeedOrder, TIngredient } from '@utils/types';

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

export type TGetOrderResponse = {
  name: string;
  orders: TFeedOrder[];
  success: boolean;
};

export const burgerApi = createApi({
  reducerPath: 'burgerApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => ({ url: 'ingredients' }),
      transformResponse: (response: TIngredientsResponse) => {
        if (!response.success) throw new Error('Ошибка запроса на сервер');
        return response.data;
      },
    }),
    postOrder: builder.mutation<TPostOrdersResponse, TPostOrdersPayload>({
      query: (body: TPostOrdersPayload) => ({
        method: 'POST',
        url: 'orders',
        body,
      }),
      transformResponse: (response: TPostOrdersResponse) => {
        if (!response.success) throw new Error('Ошибка создания заказа');
        return response;
      },
    }),
    getOrder: builder.query<TFeedOrder | null, string>({
      query: (orderNumber: string) => ({
        url: `orders/${orderNumber}`,
      }),
      transformResponse: (response: TGetOrderResponse) => {
        if (!response.success) throw new Error('Ошибка получения заказа');
        return response.orders.at(0) ?? null;
      },
    }),
  }),
});

export const { useGetIngredientsQuery, useGetOrderQuery, usePostOrderMutation } =
  burgerApi;
