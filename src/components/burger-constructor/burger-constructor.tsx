import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';

import { OrderDetails } from '../app/order-details/order-details';
import { Modal } from '../modal/modal';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

type TBurgerContents = {
  bun: TIngredient;
  body: TIngredient[];
};

const NO_BUN: TIngredient = {
  _id: '60666c42cc7b410027a1a9b1',
  name: 'Булка не выбрана',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const { bun, body } = useMemo<TBurgerContents>(
    () => ({
      bun: ingredients.find((x) => x.type === 'bun') ?? NO_BUN,
      body: ingredients.filter((x) => x.type !== 'bun'),
    }),
    [ingredients]
  );

  const [isOrderDetailsVisible, setIsOrderDetailsVisible] = useState(false);
  const orderNumber = useMemo<number>(() => Math.floor(Math.random() * 10000), []);

  function handleOpenModal(): void {
    setIsOrderDetailsVisible(true);
  }

  function handleCloseModal(): void {
    setIsOrderDetailsVisible(false);
  }

  const total = useMemo(
    () => bun.price + body.reduce((sum, ingredient) => sum + ingredient.price, 0),
    [bun, body]
  );

  const handleClose = (): void => {
    console.log('удаление');
  };

  const handleSubmit = (): void => {
    handleOpenModal();
  };

  return (
    <section className={styles.burger_constructor}>
      {
        <div className="pl-8">
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image_mobile}
          />
        </div>
      }

      <ul className={clsx(styles.list, 'custom-scroll')}>
        {body.map((ingredient) => (
          <li key={ingredient._id} className={styles.item}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image_mobile}
              handleClose={handleClose}
            />
          </li>
        ))}
      </ul>

      {
        <div className="pl-8">
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image_mobile}
          />
        </div>
      }

      <div className={clsx(styles.total, 'mt-10', 'pr-4')}>
        <p className={clsx(styles.price, 'text', 'text_type_digits-medium')}>
          {total}
          <CurrencyIcon type="primary" />
        </p>
        <Button
          onClick={handleSubmit}
          size="large"
          type="primary"
          htmlType="submit"
          extraClass="ml-10"
        >
          Оформить заказ
        </Button>
        {isOrderDetailsVisible && (
          <Modal onClose={handleCloseModal}>
            <OrderDetails orderNumber={orderNumber} />
          </Modal>
        )}
      </div>
    </section>
  );
};
