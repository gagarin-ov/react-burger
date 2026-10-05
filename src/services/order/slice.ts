import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export type TOrder = {
  number: number;
};

export type TOrderState = {
  order: TOrder | null;
};

const initialState: TOrderState = {
  order: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<TOrder | null>) => {
      state.order = action.payload;
    },
  },
  selectors: {
    getOrder: (state) => state.order,
  },
});

export const { setOrder } = orderSlice.actions;
export const { getOrder } = orderSlice.selectors;
