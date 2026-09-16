import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TIngredientsState = {
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientsState = {
  selectedIngredient: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<TIngredient | null>) => {
      state.selectedIngredient = action.payload;
    },
  },
  selectors: {
    getSelectedIngredient: (state) => state.selectedIngredient,
  },
});

export const { setSelectedIngredient } = ingredientsSlice.actions;
export const { getSelectedIngredient } = ingredientsSlice.selectors;
