'use client';

import { ContentProvider } from '@/contexts/ContentContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import Link from 'next/link';

function ContentLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuth();
  const { contentProgress } = useContent();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5fff5', display: 'flex' }}>
      {/* Left Sidebar - Content Style */}
      <aside style={{
        width: '300px',
        backgroundColor: '#2d5016',
        color: 'white',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#90ee90' }}>
            📖 Content Library
          </h1>
          {user && (
            <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
              {user.name}
            </p>
          )}
        </div>

        {/* Progress Indicator */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <div style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.9 }}>
            Overall Progress
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${contentProgress}%`,
              height: '100%',
              backgroundColor: '#90ee90',
              transition: 'width 0.3s'
            }} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>
            {contentProgress}%
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <Link 
            href="/learner/content"
            style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              border: '2px solid #90ee90',
              fontWeight: '600'
            }}
          >
            📚 My Content
          </Link>
          <Link 
            href="/learner/content/courses"
            style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: 'white',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            🎓 Courses
          </Link>
          <Link 
            href="/learner/content/videos"
            style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: 'white',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            🎥 Videos
          </Link>
          <Link 
            href="/learner/content/books"
            style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: 'white',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            📕 Books
          </Link>
          <Link 
            href="/learner/content/favorites"
            style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: 'white',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            ⭐ Favorites
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
            <Link 
              href="/learner/dashboard"
              style={{ 
                padding: '10px', 
                textDecoration: 'none', 
                color: 'white',
                fontSize: '13px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '6px'
              }}
            >
              ← Dashboard
            </Link>
            <Link 
              href="/learner/quiz"
              style={{ 
                padding: '10px', 
                textDecoration: 'none', 
                color: 'white',
                fontSize: '13px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '6px'
              }}
            >
              Quiz
            </Link>
            <Link 
              href="/learner/exam"
              style={{ 
                padding: '10px', 
                textDecoration: 'none', 
                color: 'white',
                fontSize: '13px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '6px'
              }}
            >
              Exam
            </Link>
          </div>
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            style={{
              marginTop: '15px',
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(255,255,255,0.1)',
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
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: 'white' }}>
        {children}
      </main>
    </div>
  );
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <ContentProvider>
        <ContentLayoutContent>{children}</ContentLayoutContent>
      </ContentProvider>
    </ProtectedRoute>
  );
}

