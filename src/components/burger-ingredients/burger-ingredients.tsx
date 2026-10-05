import { useGetIngredientsQuery } from '@/api/burger-api';
import { getIngredientCounts } from '@/services/burger-constructor/slice';
import {
  getSelectedIngredient,
  setSelectedIngredient,
} from '@/services/ingredient-details/slice';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

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

  const dispatch = useDispatch();
  const selectedIngredient = useSelector(getSelectedIngredient);
  const handleCloseDetails = useCallback(
    () => dispatch(setSelectedIngredient(null)),
    [dispatch]
  );

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
      {selectedIngredient && (
        <Modal header="Детали ингредиента" onClose={handleCloseDetails}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
