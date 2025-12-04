'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useTranslation } from '@/i18n';
import { useRouter } from 'next/navigation';

/**
 * Dummy Login Page
 * Allows testing different roles
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner');
  const { setAuth } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // Dummy login - creates fake user and tokens
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create dummy user based on selected role
    const dummyUser = {
      id: `user-${selectedRole}-${Date.now()}`,
      email: email || `${selectedRole}@example.com`,
      name: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} User`,
      role: selectedRole,
      avatar: undefined,
    };

    // Create dummy tokens
    const dummyTokens = {
      accessToken: `dummy-access-token-${selectedRole}-${Date.now()}`,
      refreshToken: `dummy-refresh-token-${selectedRole}-${Date.now()}`,
    };

    // Set auth and redirect
    setAuth(dummyUser, dummyTokens);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>
          {t('auth.login.title')}
        </h2>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              {t('common.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.login.email.placeholder')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              {t('common.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.login.password.placeholder')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Role (for testing):
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              <option value="learner">Learner</option>
              <option value="tutor">Tutor</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="writer">Writer</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {t('auth.login.button')}
          </button>
        </form>

        <p style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          color: '#666',
          textAlign: 'center'
        }}>
          This is a dummy login. Select a role to test different user types.
        </p>
      </div>
    </div>
  );
}

