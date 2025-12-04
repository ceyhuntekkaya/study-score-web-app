/**
 * Hook for role-based access control
 */

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

export function useRoleAccess() {
  const { role, isAuthenticated } = useAuth();

  const hasRole = (requiredRole: UserRole): boolean => {
    return isAuthenticated && role === requiredRole;
  };

  const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
    return isAuthenticated && role !== null && requiredRoles.includes(role);
  };

  const canAccess = (allowedRoles: UserRole[]): boolean => {
    return isAuthenticated && role !== null && allowedRoles.includes(role);
  };

  return {
    role,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    canAccess,
  };
}

