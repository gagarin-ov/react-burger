import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithRefresh } from '@utils/api';
import { clearTokens, getRefreshToken, saveTokens } from '@utils/token';

export type TUser = {
  email: string;
  name: string;
};

type TBaseResponse = {
  success: boolean;
  message?: string;
};

type TAuthResponse = TBaseResponse & {
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

type TUserResponse = TBaseResponse & {
  user: TUser;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TRegisterPayload = TLoginPayload & {
  name: string;
};

export type TUpdateUserPayload = Partial<TRegisterPayload>;

export type TForgotPasswordPayload = {
  email: string;
};

export type TResetPasswordPayload = {
  password: string;
  token: string; // код для восстановления пароля, полученный по email
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    login: builder.mutation<TUser, TLoginPayload>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
      transformResponse: (response: TAuthResponse): TUser => {
        if (!response.success) throw new Error('Ошибка запроса на сервер');
        saveTokens(response.accessToken, response.refreshToken);
        return response.user;
      },
    }),
    register: builder.mutation<TUser, TRegisterPayload>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
      transformResponse: (response: TAuthResponse): TUser => {
        if (!response.success) throw new Error('Ошибка запроса на сервер');
        saveTokens(response.accessToken, response.refreshToken);
        return response.user;
      },
    }),
    forgotPassword: builder.mutation<TBaseResponse, TForgotPasswordPayload>({
      query: (body) => ({ url: 'password-reset', method: 'POST', body }),
      transformResponse: (response: TBaseResponse): TBaseResponse => {
        if (!response.success)
          throw new Error(response.message ?? 'Ошибка запроса на сервер');
        return response;
      },
    }),
    resetPassword: builder.mutation<TBaseResponse, TResetPasswordPayload>({
      query: (body) => ({ url: 'password-reset/reset', method: 'POST', body }),
      transformResponse: (response: TBaseResponse): TBaseResponse => {
        if (!response.success)
          throw new Error(response.message ?? 'Ошибка запроса на сервер');
        return response;
      },
    }),
    getUser: builder.query<TUser, void>({
      query: () => ({ url: 'auth/user', method: 'GET' }),
      transformResponse: (response: TUserResponse): TUser => {
        if (!response.success) throw new Error('Ошибка запроса на сервер');
        return response.user;
      },
    }),
    updateUser: builder.mutation<TUser, TUpdateUserPayload>({
      query: (body) => ({ url: 'auth/user', method: 'PATCH', body }),
      transformResponse: (response: TUserResponse): TUser => {
        if (!response.success) throw new Error('Ошибка запроса на сервер');
        return response.user;
      },
    }),
    logout: builder.mutation<TBaseResponse, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        body: { token: getRefreshToken() },
      }),
      transformResponse: (response: TBaseResponse) => {
        clearTokens();
        return response;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
