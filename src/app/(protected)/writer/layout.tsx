'use client';

import { WriterProvider } from '@/contexts/WriterContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

function WriterLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '250px',
        backgroundColor: '#e8f5e9',
        padding: '20px',
        borderRight: '1px solid #ddd'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Writer Panel</h2>
          {user && (
            <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '14px' }}>
              {user.name}
            </p>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link 
            href="/writer/dashboard"
            style={{ padding: '10px', textDecoration: 'none', color: '#000', borderRadius: '4px' }}
          >
            Dashboard
          </Link>
          <Link 
            href="/writer/articles"
            style={{ padding: '10px', textDecoration: 'none', color: '#000', borderRadius: '4px' }}
          >
            Articles
          </Link>
          <Link 
            href="/writer/drafts"
            style={{ padding: '10px', textDecoration: 'none', color: '#000', borderRadius: '4px' }}
          >
            Drafts
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}

export default function WriterLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['writer']}>
      <WriterProvider>
        <WriterLayoutContent>{children}</WriterLayoutContent>
      </WriterProvider>
    </ProtectedRoute>
  );
}

