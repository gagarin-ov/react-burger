import { useGetIngredientsQuery } from '@api/burger-api';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useMemo } from 'react';

import { IngredientIcon } from '@components/ingredient-icon/ingredient-icon';
import { ORDER_STATUS_LABELS, getOrderIngredients } from '@utils/orders';

import type { TFeedOrder } from '@utils/types';

import styles from './feed-item.module.css';

type TFeedItemProps = {
  order: TFeedOrder;
};

export const FeedItem = ({ order }: TFeedItemProps): React.JSX.Element => {
  const { data: allIngredients = [] } = useGetIngredientsQuery();

  const { items, price } = useMemo(
    () => getOrderIngredients(order.ingredients, allIngredients),
    [allIngredients, order.ingredients]
  );

  return (
    <article className={styles.item}>
      <h2 className={clsx(styles.name, 'text', 'text_type_main-medium')}>
        {order.name}
      </h2>
      <p
        className={clsx(
          styles.status,
          'text',
          'text_type_main-default',
          'mt-3',
          order.status === 'done' && 'text_color_success'
        )}
      >
        {ORDER_STATUS_LABELS[order.status]}
      </p>
      <h3 className={clsx(styles.title, 'text', 'text_type_main-medium', 'mt-15')}>
        Состав:
      </h3>
      <ul className={clsx(styles.ingredients, 'custom-scroll', 'mt-6', 'pr-6')}>
        {items.map(({ ingredient, count }) => (
          <li key={ingredient._id} className={styles.ingredient}>
            <IngredientIcon ingredient={ingredient} />
            <p className={clsx(styles.ingredientName, 'text', 'text_type_main-default')}>
              {ingredient.name}
            </p>
            <p className={clsx(styles.price, 'text', 'text_type_digits-default')}>
              {count} x {ingredient.price}
              <CurrencyIcon type="primary" />
            </p>
          </li>
        ))}
      </ul>
      <div className={clsx(styles.footer, 'mt-10')}>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
        <p className={clsx(styles.price, 'text', 'text_type_digits-default')}>
          {price}
          <CurrencyIcon type="primary" />
        </p>
      </div>
    </article>
  );
};

export default FeedItem;
