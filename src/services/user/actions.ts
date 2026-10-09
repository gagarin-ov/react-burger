import { authApi } from '@api/auth-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { isTokenExists } from '@utils/token';

import { setIsAuthChecked, setUser } from './slice';

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (isTokenExists()) {
        const response = await dispatch(
          authApi.endpoints.getUser.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          })
        );
        dispatch(setUser(response.data ?? null));
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации', error);
      dispatch(setUser(null));
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);
