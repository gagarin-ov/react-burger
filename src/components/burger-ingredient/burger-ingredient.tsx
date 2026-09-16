import { setSelectedIngredient } from '@/services/ingredients/slice';
import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

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
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const dispatch = useDispatch();

  function handleOpenModal(): void {
    dispatch(setSelectedIngredient(ingredient));
    setIsDetailsVisible(true);
  }

  const handleCloseModal = useCallback(() => setIsDetailsVisible(false), []);

  return (
    <li className={styles.card} onClick={handleOpenModal}>
      {count > 0 && <Counter count={count} size="default" />}
      <img className={styles.image} src={ingredient.image} alt={ingredient.name} />
      <p className={clsx(styles.price, 'text', 'text_type_digits-default', 'mt-1')}>
        {ingredient.price}
        <CurrencyIcon type="primary" />
      </p>
      <p className={clsx(styles.name, 'text', 'text_type_main-default', 'mt-1')}>
        {ingredient.name}
      </p>
      {isDetailsVisible && (
        <Modal header="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={ingredient} />
        </Modal>
      )}
    </li>
  );
};
