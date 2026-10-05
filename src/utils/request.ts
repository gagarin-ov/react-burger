import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError): string =>
  'status' in error ? `код: ${error.status}` : (error.message ?? 'неизвестная ошибка');
