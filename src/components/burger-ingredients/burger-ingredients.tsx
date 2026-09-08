import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useMemo } from 'react';

import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

const GROUPS = [
  { type: 'bun', title: 'Булки' },
  { type: 'sauce', title: 'Соусы' },
  { type: 'main', title: 'Начинки' },
];

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const counts = useMemo<Record<string, number>>(
    () => ({
      [ingredients[0]._id]: 1,
      [ingredients[1]._id]: 1,
    }),
    [ingredients]
  );

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <div className={clsx(styles.list, 'custom-scroll', 'mt-10')}>
        {GROUPS.map(({ type, title }) => (
          <div key={type}>
            <h2 className="text text_type_main-medium">{title}</h2>
            <ul className={clsx(styles.cards, 'mt-6', 'pl-4')}>
              {ingredients
                .filter((ingredient) => ingredient.type === type)
                .map((ingredient) => (
                  <BurgerIngredient
                    key={ingredient._id}
                    ingredient={ingredient}
                    count={counts[ingredient._id] ?? 0}
                  />
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
