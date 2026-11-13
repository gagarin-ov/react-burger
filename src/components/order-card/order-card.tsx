import { useGetIngredientsQuery } from '@api/burger-api';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { IngredientIcon } from '@components/ingredient-icon/ingredient-icon';
import {
  ORDER_STATUS_LABELS,
  formatOrderNumber,
  getOrderIngredients,
} from '@utils/orders';

import type { TFeedOrder } from '@utils/types';

import styles from './order-card.module.css';

const MAX_VISIBLE_INGREDIENTS = 6;

type TOrderCardProps = {
  order: TFeedOrder;
  basePath?: string;
  showStatus?: boolean;
};

export const OrderCard = ({
  order,
  basePath = '/feed',
  showStatus = false,
}: TOrderCardProps): React.JSX.Element => {
  const location = useLocation();
  const { data: allIngredients = [] } = useGetIngredientsQuery();

  const { items, price } = useMemo(
    () => getOrderIngredients(order.ingredients, allIngredients),
    [allIngredients, order.ingredients]
  );

  const visible = items.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenCount = items.length - MAX_VISIBLE_INGREDIENTS;

  return (
    <li>
      <Link
        to={`${basePath}/${order.number}`}
        state={{ background: location }}
        className={clsx(styles.card, 'p-6')}
      >
        <div className={styles.header}>
          <p className="text text_type_digits-default">
            #{formatOrderNumber(order.number)}
          </p>
          <FormattedDate
            date={new Date(order.createdAt)}
            className="text text_type_main-default text_color_inactive"
          />
        </div>
        <h2 className={clsx(styles.name, 'text', 'text_type_main-medium', 'mt-6')}>
          {order.name}
        </h2>
        {showStatus && (
          <p
            className={clsx(
              styles.status,
              'text',
              'text_type_main-default',
              'mt-2',
              order.status === 'done' && 'text_color_success'
            )}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </p>
        )}
        <div className={clsx(styles.footer, 'mt-6')}>
          <ul className={styles.ingredients}>
            {visible.map(({ ingredient }, index) => (
              <li
                key={ingredient._id}
                className={styles.ingredient}
                style={{ zIndex: MAX_VISIBLE_INGREDIENTS - index }}
              >
                <IngredientIcon
                  ingredient={ingredient}
                  hiddenCount={
                    index === MAX_VISIBLE_INGREDIENTS - 1 ? Math.max(hiddenCount, 0) : 0
                  }
                />
              </li>
            ))}
          </ul>
          <p className={clsx(styles.price, 'text', 'text_type_digits-default', 'ml-6')}>
            {price}
            <CurrencyIcon type="primary" />
          </p>
        </div>
      </Link>
    </li>
  );
};
