import { useGetIngredientsQuery } from '@api/burger-api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import ErrorBoundary from '@components/error-boundary/error-boundary';
import { DndContext } from '@contexts/dnd-context';
import { getErrorMessage } from '@utils/request';

import type { TIngredient } from '@utils/types';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const { isLoading, error } = useGetIngredientsQuery();
  const [draggingType, setDraggingType] = useState<TIngredient['type'] | null>(null);

  return (
    <>
      <ErrorBoundary>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={styles.main}>
          {isLoading && <Preloader />}
          {error && (
            <p className="text text_type_main-default">
              Ошибка загрузки {getErrorMessage(error)}
            </p>
          )}
          {!isLoading && !error && (
            <DndContext value={{ draggingType, setDraggingType }}>
              <BurgerIngredients />
              <BurgerConstructor />
            </DndContext>
          )}
        </main>
      </ErrorBoundary>
    </>
  );
};

export default Home;
