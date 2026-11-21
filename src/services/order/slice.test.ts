import { describe, it, expect } from 'vitest';

import orderReducer, { setOrder, type TOrder, type TOrderState } from './slice';

const initialState: TOrderState = {
  order: null,
};

const order: TOrder = {
  number: 234,
};

describe('orderSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const result = orderReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('setOrder должен устанавливать заказ', () => {
    const result = orderReducer(initialState, setOrder(order));
    expect(result.order).toEqual(order);
  });

  it('setOrder должен сбрасывать заказ', () => {
    const result = orderReducer({ order }, setOrder(null));
    expect(result.order).toBeNull();
  });
});
