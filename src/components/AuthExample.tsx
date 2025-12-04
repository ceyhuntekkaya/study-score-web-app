'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

/**
 * Example component demonstrating token management
 * Tokens persist across page refreshes (F5)
 */
export default function AuthExample() {
  const { accessToken, refreshToken, isAuthenticated, setTokens, clearTokens, updateAccessToken } = useAuth();
  const [accessTokenInput, setAccessTokenInput] = useState('');
  const [refreshTokenInput, setRefreshTokenInput] = useState('');

  const handleSetTokens = () => {
    if (accessTokenInput && refreshTokenInput) {
      setTokens({
        accessToken: accessTokenInput,
        refreshToken: refreshTokenInput,
      });
      setAccessTokenInput('');
      setRefreshTokenInput('');
    }
  };

  const handleUpdateAccessToken = () => {
    if (accessTokenInput) {
      updateAccessToken(accessTokenInput);
      setAccessTokenInput('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Token Management Example</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Current Status</h3>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>Access Token:</strong> {accessToken ? `${accessToken.substring(0, 20)}...` : 'Not set'}</p>
        <p><strong>Refresh Token:</strong> {refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Not set'}</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          💡 Tokens are stored in localStorage and will persist after F5 refresh
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Set Tokens</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Access Token"
            value={accessTokenInput}
            onChange={(e) => setAccessTokenInput(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            placeholder="Refresh Token"
            value={refreshTokenInput}
            onChange={(e) => setRefreshTokenInput(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button
            onClick={handleSetTokens}
            style={{
              padding: '10px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Set Both Tokens
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Update Access Token Only</h3>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="New Access Token"
            value={accessTokenInput}
            onChange={(e) => setAccessTokenInput(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
          />
          <button
            onClick={handleUpdateAccessToken}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Update Access Token
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={clearTokens}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear All Tokens
        </button>
      </div>
    </div>
  );
}

