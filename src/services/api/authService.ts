/**
 * Authentication Service
 */

import { apiClient } from './client';
import { AuthResponse, User } from '@/types';

export const authService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Login failed');
    }

    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Token refresh failed');
    }

    return response.data;
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get user info');
    }

    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};

