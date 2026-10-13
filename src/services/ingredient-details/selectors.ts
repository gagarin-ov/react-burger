import { burgerApi } from '@api/burger-api';
import { createSelector } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

const selectIngredientsResult = burgerApi.endpoints.getIngredients.select();

// Выбранный ингредиент определяется параметром :id маршрута /ingredients/:id
export const selectIngredientById = createSelector(
  [
    selectIngredientsResult,
    (_state: unknown, id: string | undefined): string | undefined => id,
  ],
  (ingredientsResult, id): TIngredient | null =>
    ingredientsResult.data?.find((ingredient) => ingredient._id === id) ?? null
);
