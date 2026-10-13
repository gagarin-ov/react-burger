import { API_URL } from './const';

import type { SerializedError } from '@reduxjs/toolkit';

export type RequestExtraOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

export class RequestError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const getErrorMessage = (error: { status: unknown } | SerializedError): string =>
  'status' in error
    ? `код: ${String(error.status)}`
    : (error.message ?? 'неизвестная ошибка');

const defaultRequestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function request<T = unknown>(
  url: string,
  extraOptions: RequestExtraOptions = {}
): Promise<T> {
  const options = {
    ...defaultRequestOptions,
    ...extraOptions,
    headers: {
      ...defaultRequestOptions.headers,
      ...extraOptions.headers,
    },
  };

  const endpoint = url.replace(/^\/+/, '');
  const response = await fetch(`${API_URL}/${endpoint}`, options);

  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string; success?: boolean })
    | null;

  if (!response.ok || data?.success === false) {
    const message = data?.message ?? `Ошибка запроса: ${response.status}`;
    throw new RequestError(message, response.status, data);
  }

  return data as T;
}

export const getApiErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  if (typeof error === 'object' && 'data' in error) {
    const { data } = error;
    if (data && typeof data === 'object' && 'message' in data) {
      return String(data.message);
    }
  }
  return 'Ошибка запроса на сервер';
};
