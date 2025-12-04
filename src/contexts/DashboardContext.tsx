'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DashboardContextType {
  dashboardData: any | null;
  refreshDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState<any | null>(null);

  // Restore dashboard data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('dashboard_data');
      if (savedData) {
        try {
          setDashboardData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing dashboard data:', error);
        }
      }
    }
  }, []);

  // Save dashboard data to localStorage
  useEffect(() => {
    if (dashboardData && typeof window !== 'undefined') {
      localStorage.setItem('dashboard_data', JSON.stringify(dashboardData));
    }
  }, [dashboardData]);

  const handleRefreshDashboard = () => {
    // This would typically fetch from API
    // For now, just a placeholder
    console.log('Refreshing dashboard...');
  };

  const value: DashboardContextType = {
    dashboardData,
    refreshDashboard: handleRefreshDashboard,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

