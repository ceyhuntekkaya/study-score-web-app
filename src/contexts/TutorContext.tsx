'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TutorContextType {
  tutorData: any | null;
  refreshData: () => void;
}

const TutorContext = createContext<TutorContextType | undefined>(undefined);

export function TutorProvider({ children }: { children: React.ReactNode }) {
  const [tutorData, setTutorData] = useState<any | null>(null);

  // Restore tutor data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('tutor_data');
      if (savedData) {
        try {
          setTutorData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing tutor data:', error);
        }
      }
    }
  }, []);

  // Save tutor data to localStorage
  useEffect(() => {
    if (tutorData && typeof window !== 'undefined') {
      localStorage.setItem('tutor_data', JSON.stringify(tutorData));
    }
  }, [tutorData]);

  const handleRefreshData = () => {
    console.log('Refreshing tutor data...');
  };

  const value: TutorContextType = {
    tutorData,
    refreshData: handleRefreshData,
  };

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>;
}

export function useTutor() {
  const context = useContext(TutorContext);
  if (context === undefined) {
    throw new Error('useTutor must be used within a TutorProvider');
  }
  return context;
}

