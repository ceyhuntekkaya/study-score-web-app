/**
 * Constants
 */

import { UserRole, Language } from '@/types';
import { getApiInvokeUrl } from '@/config';

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

export const API_BASE_URL = getApiInvokeUrl();

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

