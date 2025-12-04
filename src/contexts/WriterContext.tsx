'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WriterContextType {
  writerData: any | null;
  refreshData: () => void;
}

const WriterContext = createContext<WriterContextType | undefined>(undefined);

export function WriterProvider({ children }: { children: React.ReactNode }) {
  const [writerData, setWriterData] = useState<any | null>(null);

  // Restore writer data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('writer_data');
      if (savedData) {
        try {
          setWriterData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing writer data:', error);
        }
      }
    }
  }, []);

  // Save writer data to localStorage
  useEffect(() => {
    if (writerData && typeof window !== 'undefined') {
      localStorage.setItem('writer_data', JSON.stringify(writerData));
    }
  }, [writerData]);

  const handleRefreshData = () => {
    console.log('Refreshing writer data...');
  };

  const value: WriterContextType = {
    writerData,
    refreshData: handleRefreshData,
  };

  return <WriterContext.Provider value={value}>{children}</WriterContext.Provider>;
}

export function useWriter() {
  const context = useContext(WriterContext);
  if (context === undefined) {
    throw new Error('useWriter must be used within a WriterProvider');
  }
  return context;
}

