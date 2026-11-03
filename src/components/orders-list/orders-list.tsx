import { clsx } from 'clsx';

import { OrderCard } from '@components/order-card/order-card';

import type { TFeedOrder } from '@utils/types';

import styles from './orders-list.module.css';

type TOrdersListProps = {
  orders: TFeedOrder[];
  basePath?: string;
  showStatus?: boolean;
  className?: string;
};

export const OrdersList = ({
  orders,
  basePath,
  showStatus,
  className,
}: TOrdersListProps): React.JSX.Element => {
  return (
    <section className={clsx(styles.section, 'custom-scroll', className)}>
      <ul className={clsx(styles.list, 'pr-2')}>
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            basePath={basePath}
            showStatus={showStatus}
          />
        ))}
      </ul>
    </section>
  );
};
