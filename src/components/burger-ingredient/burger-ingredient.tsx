import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import { useDndContext } from '@contexts/dnd-context';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredient.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count?: number;
};

export const BurgerIngredient = ({
  ingredient,
  count = 0,
}: TBurgerIngredientProps): React.JSX.Element => {
  const location = useLocation();
  const ref = useRef<HTMLLIElement>(null);
  const { setDraggingType } = useDndContext();
  const [{ isDragging }, dragRef] = useDrag<TIngredient, void, { isDragging: boolean }>(
    () => ({
      type: ingredient.type === 'bun' ? 'bun' : 'ingredient',
      item: ingredient,
      end: (): void => setDraggingType(null),
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient, setDraggingType]
  );
  dragRef(ref);

  useEffect(() => {
    if (isDragging) setDraggingType(ingredient.type);
  }, [isDragging, ingredient.type, setDraggingType]);

  return (
    <li className={clsx(styles.card, isDragging && styles.isDragging)} ref={ref}>
      <Link
        to={`/ingredients/${ingredient._id}`}
        state={{ background: location }}
        className={styles.link}
      >
        {count > 0 && <Counter count={count} size="default" />}
        <img className={styles.image} src={ingredient.image} alt={ingredient.name} />
        <p className={clsx(styles.price, 'text', 'text_type_digits-default', 'mt-1')}>
          {ingredient.price}
          <CurrencyIcon type="primary" />
        </p>
        <p className={clsx(styles.name, 'text', 'text_type_main-default', 'mt-1')}>
          {ingredient.name}
        </p>
      </Link>
    </li>
  );
};
