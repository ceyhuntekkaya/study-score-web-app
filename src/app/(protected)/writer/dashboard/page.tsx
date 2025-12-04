'use client';

import { useWriter } from '@/contexts/WriterContext';
import { useTranslation } from '@/i18n';

export default function WriterDashboardPage() {
  const { writerData, refreshData } = useWriter();
  const { t } = useTranslation();

  return (
    <div>
      <h1>Writer Dashboard</h1>
      <p>This is the writer dashboard page.</p>
      <p>F5 yapıldığında bu sayfadan devam edeceksiniz.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <h3>Writer Data</h3>
        <pre>{JSON.stringify(writerData || { message: 'No data yet' }, null, 2)}</pre>
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

