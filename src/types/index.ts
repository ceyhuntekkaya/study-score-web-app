/**
 * Type Definitions
 */

export type UserRole = 'learner' | 'tutor' | 'manager' | 'admin' | 'writer';

export type LearnerContentType = 'quiz' | 'exam' | 'content' | 'dashboard';

export type Language = 'en' | 'tr';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

