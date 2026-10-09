import { useGetIngredientsQuery } from '@api/burger-api';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';
import { getIngredientCounts } from '@services/burger-constructor/slice';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);

  const groups = useMemo(
    () => [
      { type: 'bun', title: 'Булки', groupRef: bunRef },
      { type: 'main', title: 'Начинки', groupRef: mainRef },
      { type: 'sauce', title: 'Соусы', groupRef: sauceRef },
    ],
    []
  );

  const { data: ingredients = [] } = useGetIngredientsQuery();

  const counts = useSelector(getIngredientCounts);

  const [activeTab, setActiveTab] = useState('bun');

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const containerTop = scrollRef.current.getBoundingClientRect().top;
    let closest = 'bun';
    let minDistance = Infinity;

    for (const { type, groupRef } of groups) {
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
        {groups.map(({ type, title, groupRef }) => (
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
