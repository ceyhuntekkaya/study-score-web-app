/**
 * Constants
 */

import { UserRole, Language } from '@/types';

export const ROLES: Record<UserRole, UserRole> = {
  learner: 'learner',
  tutor: 'tutor',
  manager: 'manager',
  admin: 'admin',
  writer: 'writer',
};

export const LEARNER_CONTENT_TYPES = {
  quiz: 'quiz',
  exam: 'exam',
  content: 'content',
  dashboard: 'dashboard',
} as const;

export const LANGUAGES: Record<Language, Language> = {
  en: 'en',
  tr: 'tr',
};

export const DEFAULT_LANGUAGE: Language = 'en';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';

// Role-based route paths
export const ROLE_ROUTES: Record<UserRole, string> = {
  learner: '/learner/dashboard',
  tutor: '/tutor/dashboard',
  manager: '/manager/dashboard',
  admin: '/admin/dashboard',
  writer: '/writer/dashboard',
};

// Learner content type routes
export const LEARNER_ROUTES: Record<string, string> = {
  quiz: '/learner/quiz',
  exam: '/learner/exam',
  content: '/learner/content',
  dashboard: '/learner/dashboard',
};

