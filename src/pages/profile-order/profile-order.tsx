import { useGetMessagesQuery } from '@api/socket-api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { OrdersList } from '@components/orders-list/orders-list';

import styles from './profile-order.module.css';

export const ProfileOrderPage = (): React.JSX.Element => {
  const { data: feed } = useGetMessagesQuery();

  // Сервер присылает заказы от старых к новым, в истории показываем свежие сверху
  const orders = useMemo(() => [...(feed?.orders ?? [])].reverse(), [feed]);

  if (!feed) {
    return <Preloader />;
  }

  if (orders.length === 0) {
    return <p className="text text_type_main-default">Заказов пока нет</p>;
  }

  return (
    <OrdersList
      orders={orders}
      basePath="/profile/orders"
      showStatus
      className={styles.orders}
    />
  );
};

export default ProfileOrderPage;
