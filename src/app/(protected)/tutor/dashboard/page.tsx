'use client';

import { useTutor } from '@/contexts/TutorContext';
import { useTranslation } from '@/i18n';

export default function TutorDashboardPage() {
  const { tutorData, refreshData } = useTutor();
  const { t } = useTranslation();

  return (
    <div>
      <h1>Tutor Dashboard</h1>
      <p>This is the tutor dashboard page.</p>
      <p>F5 yapıldığında bu sayfadan devam edeceksiniz.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h3>Tutor Data</h3>
        <pre>{JSON.stringify(tutorData || { message: 'No data yet' }, null, 2)}</pre>
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

