/**
 * Token Storage Utility
 * Manages accessToken and refreshToken in localStorage
 * Persists across page refreshes (F5)
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const tokenStorage = {
  /**
   * Save both tokens to localStorage
   */
  setTokens: (tokens: TokenPair): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  /**
   * Get both tokens from localStorage
   */
  getTokens: (): TokenPair | null => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
      }
    }
    return null;
  },

  /**
   * Update only the access token
   */
  setAccessToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  /**
   * Update only the refresh token
   */
  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  /**
   * Remove both tokens from localStorage
   */
  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  /**
   * Check if tokens exist
   */
  hasTokens: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!(
        localStorage.getItem(ACCESS_TOKEN_KEY) &&
        localStorage.getItem(REFRESH_TOKEN_KEY)
      );
    }
    return false;
  },
};

