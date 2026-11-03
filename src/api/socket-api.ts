import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { refreshToken } from '@utils/api';
import { WS_URL } from '@utils/const';
import { getAccessToken } from '@utils/token';

import type { TFeed } from '@utils/types';

type TSocketMessage = TFeed & {
  success: boolean;
  message?: string;
};

let socketAll: WebSocket | undefined = undefined;
let socketUser: WebSocket | undefined = undefined;
const RECONNECT_PERIOD = 3000; // Пауза 3 секунды
const INVALID_TOKEN_MESSAGE = 'Invalid or missing token';

export const socketApi = createApi({
  reducerPath: 'socketApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  // Кэш (и сокет вместе с ним) удаляется сразу, как только страница ленты размонтирована
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getMessagesAll: builder.query<TFeed | null, void>({
      queryFn: () => ({ data: null }),
      async onCacheEntryAdded(_arg, lifecycleApi) {
        let reconnectTimerId: ReturnType<typeof setTimeout> | undefined;
        // Флаг, который показывает, что компонент больше не ждёт данных
        let isUnsubscribed = false;

        // 1. Создаём функцию для установки соединения.
        const connect = (): void => {
          // Очищаем предыдущий таймер перед попыткой подключения
          if (reconnectTimerId) {
            clearTimeout(reconnectTimerId);
            reconnectTimerId = undefined;
          }

          const token = getAccessToken();
          socketAll = new WebSocket(`${WS_URL}/orders/all?token=${token}`);
          socketAll.onmessage = async (event: MessageEvent<string>): Promise<void> => {
            if (event.data === 'ping') {
              socketAll?.send('pong');
              return;
            }

            const data = JSON.parse(event.data) as TSocketMessage;

            if (data.message === INVALID_TOKEN_MESSAGE) {
              // Отключаем автопереподключение старого сокета, чтобы не открыть два соединения
              if (socketAll) socketAll.onclose = null;
              socketAll?.close();
              try {
                await refreshToken();
                connect();
              } catch (error) {
                console.error('Не удалось обновить токен:', error);
              }
              return;
            }

            if (data.success) {
              lifecycleApi.updateCachedData(() => data);
            }
          };

          socketAll.onclose = (): void => {
            if (!isUnsubscribed) {
              reconnectTimerId = setTimeout(connect, RECONNECT_PERIOD);
            }
          };

          socketAll.onerror = (error: Event): void => {
            console.error('Ошибка WebsocketAll:', error);
          };
        };
        await lifecycleApi.cacheDataLoaded;
        connect();

        try {
          await lifecycleApi.cacheEntryRemoved;
        } finally {
          isUnsubscribed = true;
          clearTimeout(reconnectTimerId);
          socketAll?.close();
        }
      },
    }),
    getMessages: builder.query<TFeed | null, void>({
      queryFn: () => ({ data: null }),
      async onCacheEntryAdded(_arg, lifecycleApi) {
        let reconnectTimerId: ReturnType<typeof setTimeout> | undefined;
        // Флаг, который показывает, что компонент больше не ждёт данных
        let isUnsubscribed = false;

        // 1. Создаём функцию для установки соединения.
        const connect = (): void => {
          // Очищаем предыдущий таймер перед попыткой подключения
          if (reconnectTimerId) {
            clearTimeout(reconnectTimerId);
            reconnectTimerId = undefined;
          }

          const token = getAccessToken();
          socketUser = new WebSocket(
            `${WS_URL}/orders?token=${token?.replace('Bearer ', '')}`
          );
          socketUser.onmessage = async (event: MessageEvent<string>): Promise<void> => {
            if (event.data === 'ping') {
              socketUser?.send('pong');
              return;
            }

            const data = JSON.parse(event.data) as TSocketMessage;

            if (data.message === INVALID_TOKEN_MESSAGE) {
              // Отключаем автопереподключение старого сокета, чтобы не открыть два соединения
              if (socketUser) socketUser.onclose = null;
              socketUser?.close();
              try {
                // refreshToken сам сохраняет новые токены
                await refreshToken();
                connect();
              } catch (error) {
                console.error('Не удалось обновить токен:', error);
              }
              return;
            }

            if (data.success) {
              lifecycleApi.updateCachedData(() => data);
            }
          };

          socketUser.onclose = (): void => {
            if (!isUnsubscribed) {
              reconnectTimerId = setTimeout(connect, RECONNECT_PERIOD);
            }
          };

          socketUser.onerror = (error: Event): void => {
            console.error('Ошибка WebSocket:', error);
          };
        };
        await lifecycleApi.cacheDataLoaded;
        connect();

        try {
          await lifecycleApi.cacheEntryRemoved;
        } finally {
          isUnsubscribed = true;
          clearTimeout(reconnectTimerId);
          socketUser?.close();
        }
      },
    }),
  }),
});

export const { useGetMessagesAllQuery, useGetMessagesQuery } = socketApi;
