/**
 * User Storage Utility
 * Manages user information in localStorage
 */

import { User } from '@/types';

const USER_KEY = 'user';

export const userStorage = {
  /**
   * Save user to localStorage
   */
  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  /**
   * Get user from localStorage
   */
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Remove user from localStorage
   */
  clearUser: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
  },
};

