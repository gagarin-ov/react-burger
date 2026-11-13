import { clsx } from 'clsx';

import { formatOrderNumber } from '@utils/orders';

import type { TFeed, TFeedOrder } from '@utils/types';

import styles from './feed-stats.module.css';

// В колонке не больше 10 номеров, остальные переносятся в следующую колонку (см. .numbers в CSS)
const NUMBERS_PER_COLUMN = 10;
const MAX_COLUMNS = 2;
const MAX_NUMBERS = NUMBERS_PER_COLUMN * MAX_COLUMNS;

type TFeedStatsProps = {
  feed: TFeed;
};

const getNumbers = (orders: TFeedOrder[], status: TFeedOrder['status']): number[] =>
  orders
    .filter((order) => order.status === status)
    .slice(0, MAX_NUMBERS)
    .map((order) => order.number);

const formatTotal = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const FeedStats = ({ feed }: TFeedStatsProps): React.JSX.Element => {
  const done = getNumbers(feed.orders, 'done');
  const pending = getNumbers(feed.orders, 'pending');

  return (
    <section className={styles.stats}>
      <div className={styles.boards}>
        <div>
          <h2 className={clsx(styles.heading, 'text', 'text_type_main-medium', 'mb-6')}>
            Готовы:
          </h2>
          <ul className={styles.numbers}>
            {done.map((number) => (
              <li
                key={number}
                className="text text_type_digits-default text_color_success"
              >
                {formatOrderNumber(number)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={clsx(styles.heading, 'text', 'text_type_main-medium', 'mb-6')}>
            В работе:
          </h2>
          <ul className={styles.numbers}>
            {pending.map((number) => (
              <li key={number} className="text text_type_digits-default">
                {formatOrderNumber(number)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-15">
        <h2 className="text text_type_main-medium">Выполнено за все время:</h2>
        <p className={clsx(styles.total, 'text', 'text_type_digits-large')}>
          {formatTotal(feed.total)}
        </p>
      </div>
      <div className="mt-15">
        <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
        <p className={clsx(styles.total, 'text', 'text_type_digits-large')}>
          {formatTotal(feed.totalToday)}
        </p>
      </div>
    </section>
  );
};
