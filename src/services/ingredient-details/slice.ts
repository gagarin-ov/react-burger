import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TIngredientDetailsState = {
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  selectedIngredient: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
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

export const { setSelectedIngredient } = ingredientDetailsSlice.actions;
export const { getSelectedIngredient } = ingredientDetailsSlice.selectors;
