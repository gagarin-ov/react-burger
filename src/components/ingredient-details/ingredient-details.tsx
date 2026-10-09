import { useGetIngredientsQuery } from '@api/burger-api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectIngredientById } from '@services/ingredient-details/selectors';

import type { TState } from '@services/store';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { isLoading, isError } = useGetIngredientsQuery();
  const ingredient = useSelector((state: TState) => selectIngredientById(state, id));

  if (isLoading) return <Preloader />;

  if (isError) {
    return (
      <p className="text text_type_main-default">Не удалось загрузить ингредиенты</p>
    );
  }

  if (!ingredient) {
    return <p className="text text_type_main-default">Ингредиент не найден</p>;
  }

  return (
    <div className={styles.details}>
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />
      <p className={clsx(styles.name, 'text', 'text_type_main-medium', 'mt-4')}>
        {ingredient.name}
      </p>
      <ul className={clsx(styles.nutrition, 'mt-8')}>
        <li className={styles.item}>
          <p className="text text_type_main-default">Калории,ккал</p>
          <p className="text text_type_digits-default mt-2">{ingredient.calories}</p>
        </li>
        <li className={styles.item}>
          <p className="text text_type_main-default">Белки, г</p>
          <p className="text text_type_digits-default mt-2">{ingredient.proteins}</p>
        </li>
        <li className={styles.item}>
          <p className="text text_type_main-default">Жиры, г</p>
          <p className="text text_type_digits-default mt-2">{ingredient.fat}</p>
        </li>
        <li className={styles.item}>
          <p className="text text_type_main-default">Углеводы, г</p>
          <p className="text text_type_digits-default mt-2">
            {ingredient.carbohydrates}
          </p>
        </li>
      </ul>
    </div>
  );
};

export default IngredientDetails;
