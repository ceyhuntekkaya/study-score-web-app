'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ManagerContextType {
  managerData: any | null;
  refreshData: () => void;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export function ManagerProvider({ children }: { children: React.ReactNode }) {
  const [managerData, setManagerData] = useState<any | null>(null);

  // Restore manager data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('manager_data');
      if (savedData) {
        try {
          setManagerData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing manager data:', error);
        }
      }
    }
  }, []);

  // Save manager data to localStorage
  useEffect(() => {
    if (managerData && typeof window !== 'undefined') {
      localStorage.setItem('manager_data', JSON.stringify(managerData));
    }
  }, [managerData]);

  const handleRefreshData = () => {
    console.log('Refreshing manager data...');
  };

  const value: ManagerContextType = {
    managerData,
    refreshData: handleRefreshData,
  };

  return <ManagerContext.Provider value={value}>{children}</ManagerContext.Provider>;
}

export function useManager() {
  const context = useContext(ManagerContext);
  if (context === undefined) {
    throw new Error('useManager must be used within a ManagerProvider');
  }
  return context;
}

