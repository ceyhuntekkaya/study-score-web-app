import Link from 'next/link';

export default function PublicHomePage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to Study Score App</h1>
      <p style={{ margin: '20px 0', fontSize: '18px' }}>
        This is a public page. Anyone can access this.
      </p>
      <Link 
        href="/login" 
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '20px'
        }}
      >
        Go to Login
      </Link>
    </div>
  );
}

