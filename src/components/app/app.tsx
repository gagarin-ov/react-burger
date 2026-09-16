import { getErrorMessage } from '@/utils/request';
import { useGetIngredientsQuery } from '@api/burger-api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import ErrorBoundary from '@components/error-boundary/error-boundary';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { isLoading, error, data: ingredients } = useGetIngredientsQuery();

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
            <p className="text text_type_main-default">
              Ошибка загрузки {getErrorMessage(error)}
            </p>
          )}
          {!isLoading && !error && (
            <>
              <BurgerIngredients ingredients={ingredients ?? []} />
              <BurgerConstructor ingredients={ingredients ?? []} />
            </>
          )}
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default App;
