import { request, RequestError } from './request';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './token';

import type { RequestExtraOptions } from './request';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

type TRefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TBaseQueryArgs = {
  url: string;
  method?: string;
  body?: unknown;
};

export type TBaseQueryError = {
  status: number | 'FETCH_ERROR';
  data: unknown;
};

async function refreshToken(): Promise<TRefreshResponse> {
  try {
    const refreshData = await request<TRefreshResponse>('auth/token', {
      body: JSON.stringify({ token: getRefreshToken() }),
    });

    saveTokens(refreshData.accessToken, refreshData.refreshToken);
    return refreshData;
  } catch (error) {
    clearTokens();
    throw error;
  }
}

async function fetchWithRefresh<T>(
  endpoint: string,
  options: RequestExtraOptions
): Promise<T> {
  try {
    return await request<T>(endpoint, options);
  } catch (error) {
    if (error instanceof RequestError && error.status === 403) {
      const refreshData = await refreshToken();

      return request<T>(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          authorization: refreshData.accessToken,
        },
      });
    } else {
      throw error;
    }
  }
}

export const baseQueryWithRefresh: BaseQueryFn<
  TBaseQueryArgs,
  unknown,
  TBaseQueryError
> = async ({ url, method = 'GET', body }) => {
  const headers: Record<string, string> = {};
  const token = getAccessToken();

  if (token) {
    headers.authorization = token;
  }

  try {
    const data = await fetchWithRefresh(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { data };
  } catch (error) {
    if (error instanceof RequestError) {
      return {
        error: { status: error.status, data: error.data ?? { message: error.message } },
      };
    }
    return {
      error: {
        status: 'FETCH_ERROR',
        data: { message: error instanceof Error ? error.message : 'Неизвестная ошибка' },
      },
    };
  }
};
