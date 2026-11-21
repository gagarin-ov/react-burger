import { describe, it, expect } from 'vitest';

import burgerConstructorReducer, {
  setBun,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  type TBurgerConstructorState,
  type TConstructorIngredient,
} from './slice';

import type { TIngredient } from '@/utils/types';

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

const baseIngredient: Omit<TIngredient, '_id' | 'name' | 'type' | 'price'> = {
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  image: '',
  image_large: '',
  image_mobile: '',
  __v: 0,
};

const bun1: TIngredient = {
  ...baseIngredient,
  _id: 'bun-1',
  name: 'булка1',
  type: 'bun',
  price: 10,
};

const bun2: TIngredient = {
  ...baseIngredient,
  _id: 'bun-2',
  name: 'булка2',
  type: 'bun',
  price: 15,
};

const sauce: TIngredient = {
  ...baseIngredient,
  _id: 'sauce-1',
  name: 'соус',
  type: 'sauce',
  price: 20,
};

const main: TIngredient = {
  ...baseIngredient,
  _id: 'main-1',
  name: 'начинка',
  type: 'main',
  price: 30,
};

const withKey = (ingredient: TIngredient, key: string): TConstructorIngredient => ({
  ...ingredient,
  key,
});

describe('burgerConstructorSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const result = burgerConstructorReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('setBun', () => {
    it('должен устанавливать булку', () => {
      const result = burgerConstructorReducer(initialState, setBun(bun1));
      expect(result).toEqual({ bun: bun1, ingredients: [] });
    });

    it('должен заменять ранее выбранную булку', () => {
      const state = burgerConstructorReducer(initialState, setBun(bun1));
      const result = burgerConstructorReducer(state, setBun(bun2));
      expect(result.bun).toEqual(bun2);
    });

    it('не должен затрагивать список ингредиентов', () => {
      const state: TBurgerConstructorState = {
        bun: null,
        ingredients: [withKey(sauce, 'a')],
      };
      const result = burgerConstructorReducer(state, setBun(bun1));
      expect(result.ingredients).toEqual(state.ingredients);
    });
  });

  describe('addIngredient', () => {
    it('должен генерировать уникальный key в prepare', () => {
      const state = burgerConstructorReducer(initialState, addIngredient(main));
      const result = burgerConstructorReducer(state, addIngredient(sauce));
      expect(result.ingredients[0].key).not.toBe(result.ingredients[1].key);
    });

    it('должен добавлять ингредиенты в конец списка', () => {
      const stateWithSauce = burgerConstructorReducer(
        initialState,
        addIngredient(sauce)
      );
      expect(stateWithSauce.ingredients[0]._id).toBe(sauce._id);

      const stateWithMain = burgerConstructorReducer(
        stateWithSauce,
        addIngredient(main)
      );
      expect(stateWithMain.ingredients[1]._id).toBe(main._id);
    });

    it('должен добавлять один и тот же ингредиент с разными key', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(sauce));
      state = burgerConstructorReducer(state, addIngredient(sauce));
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].key).not.toBe(state.ingredients[1].key);
    });

    it('должен вставлять ингредиент по указанному индексу', () => {
      const state: TBurgerConstructorState = {
        bun: null,
        ingredients: [withKey(sauce, 'a'), withKey(main, 'b')],
      };
      const result = burgerConstructorReducer(state, addIngredient(main, 1));
      expect(result.ingredients.map(({ _id }) => _id)).toEqual([
        sauce._id,
        main._id,
        main._id,
      ]);
      expect(result.ingredients[0].key).toBe('a');
      expect(result.ingredients[2].key).toBe('b');
    });

    it('должен вставлять ингредиент в начало при индексе 0', () => {
      const state: TBurgerConstructorState = {
        bun: null,
        ingredients: [withKey(sauce, 'a')],
      };
      const result = burgerConstructorReducer(state, addIngredient(main, 0));
      expect(result.ingredients.map((ingredient) => ingredient._id)).toEqual([
        main._id,
        sauce._id,
      ]);
    });
  });

  describe('deleteIngredient', () => {
    const state: TBurgerConstructorState = {
      bun: bun1,
      ingredients: [withKey(sauce, 'a'), withKey(main, 'b'), withKey(sauce, 'c')],
    };

    it('должен удалять ингредиент по key', () => {
      const result = burgerConstructorReducer(
        state,
        deleteIngredient(state.ingredients[1])
      );
      expect(result).toEqual({
        bun: bun1,
        ingredients: [withKey(sauce, 'a'), withKey(sauce, 'c')],
      });
    });

    it('должен удалять только один из одинаковых ингредиентов', () => {
      const result = burgerConstructorReducer(
        state,
        deleteIngredient(state.ingredients[2])
      );
      expect(result.ingredients).toEqual([withKey(sauce, 'a'), withKey(main, 'b')]);
    });
  });

  describe('moveIngredient', () => {
    const state: TBurgerConstructorState = {
      bun: null,
      ingredients: [withKey(sauce, 'a'), withKey(main, 'b'), withKey(sauce, 'c')],
    };

    it('должен перемещать ингредиент вниз', () => {
      const result = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );
      expect(result.ingredients.map((ingredient) => ingredient.key)).toEqual([
        'b',
        'c',
        'a',
      ]);
    });

    it('должен перемещать ингредиент вверх', () => {
      const result = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );
      expect(result.ingredients.map((ingredient) => ingredient.key)).toEqual([
        'c',
        'a',
        'b',
      ]);
    });
  });
});
