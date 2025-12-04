'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStorage, TokenPair } from '@/utils/tokenStorage';
import { userStorage } from '@/utils/userStorage';
import { User, UserRole } from '@/types';
import { ROLE_ROUTES } from '@/constants';
import { useRouter } from 'next/navigation';
import { socketService } from '@/services/socket/socketService';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  role: UserRole | null;
  setAuth: (user: User, tokens: TokenPair) => void;
  clearAuth: () => void;
  updateAccessToken: (token: string) => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Restore auth state from localStorage on mount (page refresh)
  useEffect(() => {
    const tokens = tokenStorage.getTokens();
    const savedUser = userStorage.getUser();
    
    if (tokens && savedUser) {
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setUser(savedUser);
      
      // Connect socket if authenticated
      socketService.connect().catch((error) => {
        console.error('Socket connection failed:', error);
      });
    }
    
    setIsInitialized(true);
  }, []);

  // Save tokens to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      if (accessToken && refreshToken) {
        tokenStorage.setTokens({ accessToken, refreshToken });
      } else {
        tokenStorage.clearTokens();
      }
    }
  }, [accessToken, refreshToken, isInitialized]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      if (user) {
        userStorage.setUser(user);
      } else {
        userStorage.clearUser();
      }
    }
  }, [user, isInitialized]);

  const handleSetAuth = useCallback((newUser: User, tokens: TokenPair) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setUser(newUser);
    
    // Connect socket after login
    socketService.connect().catch((error) => {
      console.error('Socket connection failed:', error);
    });
    
    // Redirect to role-based dashboard
    const roleRoute = ROLE_ROUTES[newUser.role];
    if (roleRoute) {
      router.push(roleRoute);
    }
  }, [router]);

  const handleClearAuth = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    tokenStorage.clearTokens();
    userStorage.clearUser();
    
    // Disconnect socket on logout
    socketService.disconnect();
    
    // Redirect to login
    router.push('/login');
  }, [router]);

  const handleUpdateAccessToken = useCallback((token: string) => {
    setAccessToken(token);
    tokenStorage.setAccessToken(token);
  }, []);

  const handleUpdateUser = useCallback((newUser: User) => {
    setUser(newUser);
    userStorage.setUser(newUser);
  }, []);

  const value: AuthContextType = {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: !!accessToken && !!refreshToken && !!user,
    isInitialized,
    role: user?.role || null,
    setAuth: handleSetAuth,
    clearAuth: handleClearAuth,
    updateAccessToken: handleUpdateAccessToken,
    updateUser: handleUpdateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

