import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ 
        padding: '20px', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '24px', fontWeight: 'bold' }}>
          Study Score App
        </Link>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#000' }}>Home</Link>
          <Link href="/login" style={{ textDecoration: 'none', color: '#000' }}>Login</Link>
          <LanguageSwitcher />
        </nav>
      </header>
      <main>{children}</main>
      <footer style={{ 
        padding: '20px', 
        borderTop: '1px solid #ddd',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <p>© 2024 Study Score App. All rights reserved.</p>
      </footer>
    </div>
  );
}

