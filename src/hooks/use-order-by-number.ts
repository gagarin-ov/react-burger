import { useGetOrderQuery } from '@api/burger-api';
import { socketApi } from '@api/socket-api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '@services/store';

import type { TFeedOrder } from '@utils/types';

export const useOrderByNumber = (): {
  order: TFeedOrder | undefined;
  isLoading: boolean;
} => {
  const { id } = useParams<{ id: string }>();
  // Хуки вызываются всегда, поэтому невалидный id проверяем флагом, а не ранним return
  const isValidId = Boolean(id) && !Number.isNaN(Number(id));

  const orderFromFeed = useAppSelector((state) =>
    socketApi.endpoints.getMessagesAll
      .select()(state)
      .data?.orders.find((o) => o.number === Number(id))
  );

  const shouldFetchDirectly = isValidId && !orderFromFeed;

  const { data: orderDirect, isLoading: isOrderLoading } = useGetOrderQuery(
    shouldFetchDirectly && id ? id : skipToken
  );

  const order = orderFromFeed ?? orderDirect ?? undefined;

  return { order, isLoading: isOrderLoading };
};
