'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { useTranslation } from '@/i18n';

export default function AdminDashboardPage() {
  const { adminData, refreshData } = useAdmin();
  const { t } = useTranslation();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>This is the admin dashboard page.</p>
      <p>F5 yapıldığında bu sayfadan devam edeceksiniz.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
        <h3>Admin Data</h3>
        <pre>{JSON.stringify(adminData || { message: 'No data yet' }, null, 2)}</pre>
        <button 
          onClick={refreshData}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}

