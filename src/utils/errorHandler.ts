/**
 * Error Handler Utility
 * Handles backend errors and formats them for user display
 */

import { ApiError } from '@/types';

export class AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;

  constructor(message: string, code?: string, statusCode?: number, details?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function handleApiError(error: any): ApiError {
  // Spring Boot error response format
  if (error?.response?.data) {
    const data = error.response.data;
    
    return {
      message: data.message || data.error || 'An error occurred',
      code: data.code || data.status?.toString(),
      statusCode: error.response.status || data.status,
      details: data.details || data.errors,
    };
  }

  // Network error
  if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
      statusCode: 0,
    };
  }

  // Default error
  return {
    message: error?.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: error?.status || 500,
  };
}

export function getErrorMessage(error: ApiError | Error | any): string {
  if (error instanceof AppError || (error as ApiError).message) {
    return (error as ApiError).message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

