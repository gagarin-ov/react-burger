import { usePostOrderMutation } from '@/api/burger-api';
import {
  addIngredient,
  getBun,
  getIngredients,
  getTotalPrice,
  setBun,
} from '@/services/burger-constructor/slice';
import { setOrder } from '@/services/order/slice';
import { getErrorMessage } from '@/utils/request';
import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { useModal } from '@hooks/use-modal';

import { BurgerPlaceholder } from '../burger-placeholder/burger-placeholder';
import { ConstructorBun } from '../constructor-bun/constructor-bun';
import { ConstructorIngredient } from '../constructor-ingredient/constructor-ingredient';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const [postOrder, { isLoading }] = usePostOrderMutation();
  const [orderError, setOrderError] = useState<Error | null>(null);

  const dispatch = useDispatch();
  const bun = useSelector(getBun);
  const ingredients = useSelector(getIngredients);
  const { isModalOpen, openModal, closeModal } = useModal();

  const total = useSelector(getTotalPrice);

  const listRef = useRef<HTMLUListElement>(null);
  const [, listDropRef] = useDrop<TIngredient, void, unknown>(
    () => ({
      accept: 'ingredient',
      drop: (item, monitor): void => {
        if (monitor.didDrop()) return;
        dispatch(addIngredient(item));
      },
    }),
    [dispatch]
  );
  listDropRef(listRef);

  const handleSubmit = async (): Promise<void> => {
    if (!bun) return;
    try {
      const postOrderResponse = await postOrder({
        ingredients: [
          bun._id,
          ...ingredients.map((ingredient) => ingredient._id),
          bun._id,
        ],
      }).unwrap();

      dispatch(setOrder(postOrderResponse.order));
      openModal();
    } catch (error) {
      dispatch(setOrder(null));
      setOrderError(
        new Error(
          `Ошибка оформления заказа: ${getErrorMessage(error as FetchBaseQueryError | SerializedError)}`
        )
      );
    }
  };

  if (orderError) {
    //Триггерим ErrorBoundary
    throw orderError;
  }

  return (
    <section className={styles.burger_constructor}>
      {!bun && (
        <div className="pl-8">
          <BurgerPlaceholder
            type="top"
            caption="Выберите булку"
            ingredientType="bun"
            onDrop={(item) => dispatch(setBun(item))}
          />
        </div>
      )}
      {bun && (
        <div className="pl-8">
          <ConstructorBun bun={bun} type="top" />
        </div>
      )}

      <ul ref={listRef} className={clsx(styles.list, 'custom-scroll')}>
        {ingredients.map((ingredient, index) => (
          <ConstructorIngredient
            key={ingredient.key}
            ingredient={ingredient}
            index={index}
          />
        ))}

        {!ingredients.length && (
          <div className="pl-8">
            <BurgerPlaceholder
              caption="Выберите начинку"
              ingredientType="ingredient"
              onDrop={(item) => dispatch(addIngredient(item))}
            />
          </div>
        )}
      </ul>

      {!bun && (
        <div className="pl-8">
          <BurgerPlaceholder
            type="bottom"
            caption="Выберите булку"
            ingredientType="bun"
            onDrop={(item) => dispatch(setBun(item))}
          />
        </div>
      )}

      {bun && (
        <div className="pl-8">
          <ConstructorBun bun={bun} type="bottom" />
        </div>
      )}

      <div className={clsx(styles.total, 'mt-10', 'pr-4')}>
        <p className={clsx(styles.price, 'text', 'text_type_digits-medium')}>
          {total}
          <CurrencyIcon type="primary" />
        </p>
        <Button
          onClick={() => void handleSubmit()}
          size="large"
          type="primary"
          htmlType="submit"
          extraClass="ml-10"
          disabled={!bun}
        >
          {isLoading ? 'Отправляем...' : 'Оформить заказ'}
        </Button>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <OrderDetails />
          </Modal>
        )}
      </div>
    </section>
  );
};
