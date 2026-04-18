// src/utils/errorHandler.ts
import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'Произошла ошибка';
};
