'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top Navigation Bar - Dashboard Style */}
      <header style={{
        backgroundColor: '#0070f3',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>📊 Dashboard</h1>
          <nav style={{ display: 'flex', gap: '15px', marginLeft: '30px' }}>
            <Link 
              href="/learner/dashboard"
              style={{ 
                padding: '8px 16px', 
                textDecoration: 'none', 
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              Overview
            </Link>
            <Link 
              href="/learner/dashboard/analytics"
              style={{ 
                padding: '8px 16px', 
                textDecoration: 'none', 
                color: 'white',
                borderRadius: '6px'
              }}
            >
              Analytics
            </Link>
            <Link 
              href="/learner/dashboard/progress"
              style={{ 
                padding: '8px 16px', 
                textDecoration: 'none', 
                color: 'white',
                borderRadius: '6px'
              }}
            >
              Progress
            </Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user && (
            <span style={{ fontSize: '14px' }}>👤 {user.name}</span>
          )}
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Quick Access Bar */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px 30px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        gap: '15px'
      }}>
        <Link 
          href="/learner/quiz"
          style={{ 
            padding: '8px 16px', 
            textDecoration: 'none', 
            color: '#666',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          → Quiz
        </Link>
        <Link 
          href="/learner/exam"
          style={{ 
            padding: '8px 16px', 
            textDecoration: 'none', 
            color: '#666',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          → Exam
        </Link>
        <Link 
          href="/learner/content"
          style={{ 
            padding: '8px 16px', 
            textDecoration: 'none', 
            color: '#666',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          → Content
        </Link>
      </div>

      {/* Main Content Area */}
      <main style={{ padding: '30px' }}>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <DashboardProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </DashboardProvider>
    </ProtectedRoute>
  );
}

