'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/i18n';
import { useLogin } from '@/generated/api/auth-rest-controller/auth-rest-controller';
import { mapGeneratedUserToLocal } from '@/utils/userMapper';
import { getErrorMessage } from '@/utils/errorHandler';

/**
 * Login Page with API Integration
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuth();
  const { t } = useTranslation();

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (response) => {
        try {
          // customInstance already extracts data, so response is AuthenticationResponse
          const authResponse = response as any;
          
          if (!authResponse?.user || !authResponse?.accessToken || !authResponse?.refreshToken) {
            throw new Error('Invalid response from server: missing user, accessToken, or refreshToken');
          }

          // Map generated user to local user type
          const localUser = mapGeneratedUserToLocal(authResponse.user);

          // Set tokens
          const tokens = {
            accessToken: authResponse.accessToken,
            refreshToken: authResponse.refreshToken,
          };

          // Set auth (this will redirect to role-based dashboard)
          setAuth(localUser, tokens);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to process login response';
          setError(errorMessage);
        }
      },
      onError: (error: any) => {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
      },
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    loginMutation.mutate({
      data: {
        username: username.trim(),
        password: password,
      },
    });
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
          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              {t('common.email')} / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              disabled={loginMutation.isPending}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px',
                opacity: loginMutation.isPending ? 0.6 : 1
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
              disabled={loginMutation.isPending}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px',
                opacity: loginMutation.isPending ? 0.6 : 1
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loginMutation.isPending ? '#999' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loginMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: loginMutation.isPending ? 0.7 : 1
            }}
          >
            {loginMutation.isPending ? 'Logging in...' : t('auth.login.button')}
          </button>
        </form>
      </div>
    </div>
  );
}

