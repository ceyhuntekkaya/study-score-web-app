'use client';

import { useManager } from '@/contexts/ManagerContext';
import { useTranslation } from '@/i18n';

export default function ManagerDashboardPage() {
  const { managerData, refreshData } = useManager();
  const { t } = useTranslation();

  return (
    <div>
      <h1>Manager Dashboard</h1>
      <p>This is the manager dashboard page.</p>
      <p>F5 yapıldığında bu sayfadan devam edeceksiniz.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
        <h3>Manager Data</h3>
        <pre>{JSON.stringify(managerData || { message: 'No data yet' }, null, 2)}</pre>
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

