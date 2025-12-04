'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  adminData: any | null;
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminData, setAdminData] = useState<any | null>(null);

  // Restore admin data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('admin_data');
      if (savedData) {
        try {
          setAdminData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing admin data:', error);
        }
      }
    }
  }, []);

  // Save admin data to localStorage
  useEffect(() => {
    if (adminData && typeof window !== 'undefined') {
      localStorage.setItem('admin_data', JSON.stringify(adminData));
    }
  }, [adminData]);

  const handleRefreshData = () => {
    console.log('Refreshing admin data...');
  };

  const value: AdminContextType = {
    adminData,
    refreshData: handleRefreshData,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

