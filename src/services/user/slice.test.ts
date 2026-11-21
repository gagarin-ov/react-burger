import { describe, it, expect } from 'vitest';

import userReducer, { setUser, setIsAuthChecked, type TUserState } from './slice';

import type { TUser } from '@/api/auth-api';
import type { UnknownAction } from '@reduxjs/toolkit';

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
};

const user: TUser = {
  email: 'test@test.test',
  name: 'test',
};

const updatedUser: TUser = {
  email: 'new@test.test',
  name: 'new name',
};

/**
 * Экшен успешного запроса RTK Query: по нему срабатывают
 * матчеры `authApi.endpoints.<endpoint>.matchFulfilled` в extraReducers.
 */
const createFulfilledAction = (
  endpointName: string,
  requestType: 'query' | 'mutation',
  payload: unknown
): UnknownAction => ({
  type: `authApi/${requestType === 'query' ? 'executeQuery' : 'executeMutation'}/fulfilled`,
  payload,
  meta: {
    requestId: 'test-request',
    requestStatus: 'fulfilled',
    arg: { endpointName, type: requestType, originalArgs: undefined },
  },
});

describe('userSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const result = userReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('reducers', () => {
    it('setUser должен устанавливать пользователя', () => {
      const result = userReducer(initialState, setUser(user));
      expect(result.user).toEqual(user);
    });

    it('setUser должен сбрасывать пользователя', () => {
      const result = userReducer({ ...initialState, user }, setUser(null));
      expect(result.user).toBeNull();
    });

    it('setIsAuthChecked должен устанавливать флаг проверки', () => {
      const checkedState = userReducer(initialState, setIsAuthChecked(true));
      expect(checkedState.isAuthChecked).toBe(true);

      const uncheckedState = userReducer(checkedState, setIsAuthChecked(false));
      expect(uncheckedState.isAuthChecked).toBe(false);
    });
  });

  describe('extraReducers', () => {
    it('login сохраняет пользователя и ставит isAuthChecked = true', () => {
      const result = userReducer(
        initialState,
        createFulfilledAction('login', 'mutation', user)
      );
      expect(result).toEqual({ user, isAuthChecked: true });
    });

    it('register сохраняет пользователя и ставит isAuthChecked = true', () => {
      const result = userReducer(
        initialState,
        createFulfilledAction('register', 'mutation', user)
      );
      expect(result).toEqual({ user, isAuthChecked: true });
    });

    it('getUser сохраняет пользователя', () => {
      const result = userReducer(
        initialState,
        createFulfilledAction('getUser', 'query', user)
      );
      expect(result).toEqual({ user, isAuthChecked: false });
    });

    it('updateUser обновляет данные пользователя', () => {
      const result = userReducer(
        { user, isAuthChecked: true },
        createFulfilledAction('updateUser', 'mutation', updatedUser)
      );
      expect(result).toEqual({ user: updatedUser, isAuthChecked: true });
    });

    it('logout удаляет пользователя', () => {
      const result = userReducer(
        { user, isAuthChecked: true },
        createFulfilledAction('logout', 'mutation', { success: true })
      );
      expect(result).toEqual({ user: null, isAuthChecked: true });
    });
  });
});
