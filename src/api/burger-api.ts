import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/const';

import type { TIngredient } from '@utils/types';

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const burgerApi = createApi({
  reducerPath: 'burgerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => ({ url: '/ingredients' }),
      transformResponse: (res: TIngredientsResponse) => {
        if (!res.success) throw new Error('Ошибка запроса на сервер');
        return res.data;
      },
    }),
  }),
});

export const { useGetIngredientsQuery } = burgerApi;
