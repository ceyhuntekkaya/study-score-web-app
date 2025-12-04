/**
 * API Client
 * Axios-based HTTP client with token management and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';
import { handleApiError, AppError } from '@/utils/errorHandler';
import { ApiResponse } from '@/types';
import { API_BASE_URL } from '@/constants';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add access token to requests
    this.client.interceptors.request.use(
      (config) => {
        const accessToken = tokenStorage.getAccessToken();
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to refresh token
          const refreshToken = tokenStorage.getRefreshToken();
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data;
              tokenStorage.setTokens({ accessToken, refreshToken: newRefreshToken });

              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this.client(originalRequest);
            } catch (refreshError) {
              // Refresh failed - clear tokens and redirect to login
              tokenStorage.clearTokens();
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        error: apiError,
      };
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        error: apiError,
      };
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        error: apiError,
      };
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        error: apiError,
      };
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        error: apiError,
      };
    }
  }
}

export const apiClient = new ApiClient();

