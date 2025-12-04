'use client';

import { QuizProvider } from '@/contexts/QuizContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import Link from 'next/link';

function QuizLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuth();
  // Note: useQuiz is available here because QuizProvider wraps this component
  const { quizProgress } = useQuiz();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff5f5' }}>
      {/* Top Bar - Quiz Style */}
      <header style={{
        backgroundColor: '#ff6b6b',
        color: 'white',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>❓ Quiz Center</h1>
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
            Progress: {quizProgress}%
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

      {/* Quiz Navigation Sidebar */}
      <div style={{ display: 'flex' }}>
        <aside style={{
          width: '280px',
          backgroundColor: 'white',
          padding: '25px',
          borderRight: '2px solid #ff6b6b',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link 
              href="/learner/quiz"
              style={{ 
                padding: '12px 16px', 
                textDecoration: 'none', 
                color: '#333',
                backgroundColor: '#fff5f5',
                borderRadius: '8px',
                border: '2px solid #ff6b6b',
                fontWeight: '600'
              }}
            >
              🎯 Active Quiz
            </Link>
            <Link 
              href="/learner/quiz/history"
              style={{ 
                padding: '12px 16px', 
                textDecoration: 'none', 
                color: '#666',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}
            >
              📚 Quiz History
            </Link>
            <Link 
              href="/learner/quiz/practice"
              style={{ 
                padding: '12px 16px', 
                textDecoration: 'none', 
                color: '#666',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}
            >
              💪 Practice Mode
            </Link>
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
              <Link 
                href="/learner/dashboard"
                style={{ 
                  padding: '10px 16px', 
                  textDecoration: 'none', 
                  color: '#666',
                  fontSize: '14px',
                  display: 'block'
                }}
              >
                ← Back to Dashboard
              </Link>
              <Link 
                href="/learner/exam"
                style={{ 
                  padding: '10px 16px', 
                  textDecoration: 'none', 
                  color: '#666',
                  fontSize: '14px',
                  display: 'block'
                }}
              >
                → Go to Exam
              </Link>
              <Link 
                href="/learner/content"
                style={{ 
                  padding: '10px 16px', 
                  textDecoration: 'none', 
                  color: '#666',
                  fontSize: '14px',
                  display: 'block'
                }}
              >
                → Go to Content
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '30px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <QuizProvider>
        <QuizLayoutContent>{children}</QuizLayoutContent>
      </QuizProvider>
    </ProtectedRoute>
  );
}

