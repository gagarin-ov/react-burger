import { useGetMessagesAllQuery } from '@api/socket-api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';

import { FeedStats } from '@components/feed-stats/feed-stats';
import { OrdersList } from '@components/orders-list/orders-list';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  // Пока сокет не прислал первое сообщение, данных нет
  const { data: feed } = useGetMessagesAllQuery();

  if (!feed) {
    return <Preloader />;
  }

  return (
    <>
      <h1
        className={clsx(styles.title, 'text', 'text_type_main-large', 'mt-10', 'mb-5')}
      >
        Лента заказов
      </h1>
      <main className={styles.main}>
        {feed.orders.length === 0 ? (
          <p className="text text_type_main-default">Заказов пока нет</p>
        ) : (
          <>
            <OrdersList orders={feed.orders} />
            <FeedStats feed={feed} />
          </>
        )}
      </main>
    </>
  );
};

export default FeedPage;
