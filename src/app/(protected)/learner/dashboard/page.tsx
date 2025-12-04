'use client';

import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { useTranslation } from '@/i18n';

function DashboardContent() {
  const { dashboardData, refreshDashboard } = useDashboard();
  const { t } = useTranslation();

  return (
    <div>
      <h1>Learner Dashboard</h1>
      <p>This is the learner dashboard page. Content type: Dashboard</p>
      <p>F5 yapıldığında bu sayfadan devam edeceksiniz.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Dashboard Data</h3>
        <pre>{JSON.stringify(dashboardData || { message: 'No data yet' }, null, 2)}</pre>
        <button 
          onClick={refreshDashboard}
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
          Refresh Dashboard
        </button>
      </div>
    </div>
  );
}

export default function LearnerDashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

