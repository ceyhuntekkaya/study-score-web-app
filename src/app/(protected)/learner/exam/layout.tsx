'use client';

import { ExamProvider } from '@/contexts/ExamContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useExam } from '@/contexts/ExamContext';
import Link from 'next/link';

function ExamLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuth();
  const { examProgress } = useExam();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4ff' }}>
      {/* Top Bar - Exam Style */}
      <header style={{
        backgroundColor: '#4d79ff',
        color: 'white',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>📝 Exam Center</h1>
          {user && (
            <span style={{ fontSize: '14px', opacity: 0.9 }}>👤 {user.name}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Progress: {examProgress}%
          </div>
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

      {/* Exam Navigation - Horizontal Tabs */}
      <div style={{
        backgroundColor: 'white',
        padding: '0 30px',
        borderBottom: '2px solid #4d79ff',
        display: 'flex',
        gap: '0'
      }}>
        <Link 
          href="/learner/exam"
          style={{ 
            padding: '15px 25px', 
            textDecoration: 'none', 
            color: '#4d79ff',
            borderBottom: '3px solid #4d79ff',
            fontWeight: '600',
            backgroundColor: '#f0f4ff'
          }}
        >
          📋 Current Exam
        </Link>
        <Link 
          href="/learner/exam/schedule"
          style={{ 
            padding: '15px 25px', 
            textDecoration: 'none', 
            color: '#666',
            borderBottom: '3px solid transparent'
          }}
        >
          📅 Schedule
        </Link>
        <Link 
          href="/learner/exam/results"
          style={{ 
            padding: '15px 25px', 
            textDecoration: 'none', 
            color: '#666',
            borderBottom: '3px solid transparent'
          }}
        >
          📊 Results
        </Link>
        <Link 
          href="/learner/exam/archive"
          style={{ 
            padding: '15px 25px', 
            textDecoration: 'none', 
            color: '#666',
            borderBottom: '3px solid transparent'
          }}
        >
          🗄️ Archive
        </Link>
      </div>

      {/* Quick Links Bar */}
      <div style={{
        backgroundColor: '#f0f4ff',
        padding: '12px 30px',
        display: 'flex',
        gap: '15px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Link 
          href="/learner/dashboard"
          style={{ 
            padding: '6px 12px', 
            textDecoration: 'none', 
            color: '#4d79ff',
            fontSize: '13px'
          }}
        >
          ← Dashboard
        </Link>
        <Link 
          href="/learner/quiz"
          style={{ 
            padding: '6px 12px', 
            textDecoration: 'none', 
            color: '#4d79ff',
            fontSize: '13px'
          }}
        >
          Quiz
        </Link>
        <Link 
          href="/learner/content"
          style={{ 
            padding: '6px 12px', 
            textDecoration: 'none', 
            color: '#4d79ff',
            fontSize: '13px'
          }}
        >
          Content
        </Link>
      </div>

      {/* Main Content */}
      <main style={{ padding: '30px' }}>
        {children}
      </main>
    </div>
  );
}

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <ExamProvider>
        <ExamLayoutContent>{children}</ExamLayoutContent>
      </ExamProvider>
    </ProtectedRoute>
  );
}

