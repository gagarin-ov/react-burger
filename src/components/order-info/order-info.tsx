import { clsx } from 'clsx';

import { FeedItem } from '@components/feed-item/feed-item';
import { formatOrderNumber } from '@utils/orders';

import type { TFeedOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  order?: TFeedOrder;
};

export const OrderInfo = ({ order }: TOrderInfoProps): React.JSX.Element => {
  if (!order) {
    return <p className="text text_type_main-default">Заказ не найден</p>;
  }

  return (
    <>
      <h1 className={clsx(styles.number, 'text', 'text_type_digits-default', 'mb-10')}>
        #{formatOrderNumber(order.number)}
      </h1>
      <FeedItem order={order} />
    </>
  );
};

export default OrderInfo;
