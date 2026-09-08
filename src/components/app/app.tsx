import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import ErrorBoundary from '@components/error-boundary/error-boundary';
import { getData } from '@utils/request';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getData<TIngredient[]>('/ingredients')
      .then(({ data }) => setIngredients(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <ErrorBoundary>
        <main className={styles.main}>
          {isLoading && <Preloader />}
          {error && (
            <p className="text text_type_main-default">Ошибка загрузки: {error}</p>
          )}
          {!isLoading && !error && (
            <>
              <BurgerIngredients ingredients={ingredients} />
              <BurgerConstructor ingredients={ingredients} />
            </>
          )}
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default App;
