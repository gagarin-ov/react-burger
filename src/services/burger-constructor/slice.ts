import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TConstructorIngredient = TIngredient & { key: string };

export type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type TAddIngredientPayload = {
  ingredient: TConstructorIngredient;
  index?: number;
};

export type TMoveIngredientPayload = {
  fromIndex: number;
  toIndex: number;
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

const selectBun = (state: TBurgerConstructorState): TIngredient | null => state.bun;
const selectIngredients = (state: TBurgerConstructorState): TConstructorIngredient[] =>
  state.ingredients;

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TAddIngredientPayload>) => {
        const { ingredient, index } = action.payload;
        if (index === undefined) {
          state.ingredients.push(ingredient);
        } else {
          state.ingredients.splice(index, 0, ingredient);
        }
      },
      prepare: (item: TIngredient, index?: number) => {
        return { payload: { ingredient: { ...item, key: nanoid() }, index } };
      },
    },
    deleteIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.key !== action.payload.key
      );
    },
    moveIngredient: (state, action: PayloadAction<TMoveIngredientPayload>) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedIngredient);
    },
  },
  selectors: {
    getBun: selectBun,
    getIngredients: selectIngredients,
    getIngredientCounts: createSelector(
      [selectBun, selectIngredients],
      (bun, ingredients): Record<string, number> => {
        const counts: Record<string, number> = {};
        for (const { _id } of ingredients) counts[_id] = (counts[_id] ?? 0) + 1;
        if (bun) counts[bun._id] = 2;
        return counts;
      }
    ),
    getTotalPrice: createSelector(
      [selectBun, selectIngredients],
      (bun, ingredients): number =>
        (bun ? bun.price * 2 : 0) +
        ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
    ),
  },
});

export const { setBun, addIngredient, deleteIngredient, moveIngredient } =
  burgerConstructorSlice.actions;
export const { getBun, getIngredients, getIngredientCounts, getTotalPrice } =
  burgerConstructorSlice.selectors;
