'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, role, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to be initialized before checking
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      // User doesn't have required role - redirect to their dashboard
      const roleRoutes: Record<UserRole, string> = {
        learner: '/learner/dashboard',
        tutor: '/tutor/dashboard',
        manager: '/manager/dashboard',
        admin: '/admin/dashboard',
        writer: '/writer/dashboard',
      };

      const userRoute = roleRoutes[role] || '/login';
      router.push(userRoute);
    }
  }, [isInitialized, isAuthenticated, role, user, allowedRoles, redirectTo, router]);

  // Show loading while auth is being initialized
  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show loading or nothing while checking
  if (!isAuthenticated || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Access Denied</div>
      </div>
    );
  }

  return <>{children}</>;
}

