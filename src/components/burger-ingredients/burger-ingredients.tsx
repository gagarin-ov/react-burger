import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';

import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);

  const GROUPS = useMemo(
    () => [
      { type: 'bun', title: 'Булки', groupRef: bunRef },
      { type: 'main', title: 'Начинки', groupRef: mainRef },
      { type: 'sauce', title: 'Соусы', groupRef: sauceRef },
    ],
    []
  );

  const counts = useMemo<Record<string, number>>(
    () => ({
      //сделано без проверки количества, по сути моковые данные для счетчика
      [ingredients[0]._id]: 1,
      [ingredients[1]._id]: 1,
    }),
    [ingredients]
  );

  const [activeTab, setActiveTab] = useState('bun');

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const containerTop = scrollRef.current.getBoundingClientRect().top;

    // Ищем заголовок, ближайший к верхней границе контейнера
    let closest = 'bun';
    let minDistance = Infinity;

    for (const { type, groupRef } of GROUPS) {
      if (!groupRef.current) continue;
      const distance = Math.abs(
        groupRef.current.getBoundingClientRect().top - containerTop
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = type;
      }
    }

    setActiveTab(closest);
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={activeTab === 'bun'}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={activeTab === 'main'}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={activeTab === 'sauce'}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <div
        ref={scrollRef}
        className={clsx(styles.list, 'custom-scroll', 'mt-10')}
        onScroll={() => handleScroll()}
      >
        {GROUPS.map(({ type, title, groupRef }) => (
          <div key={type}>
            <h2 ref={groupRef} className="text text_type_main-medium">
              {title}
            </h2>
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
