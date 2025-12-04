'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ExamContextType {
  currentExam: any | null;
  examProgress: number;
  setCurrentExam: (exam: any) => void;
  updateProgress: (progress: number) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [currentExam, setCurrentExam] = useState<any | null>(null);
  const [examProgress, setExamProgress] = useState(0);

  // Restore exam state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedExam = localStorage.getItem('exam_state');
      const savedProgress = localStorage.getItem('exam_progress');
      
      if (savedExam) {
        try {
          setCurrentExam(JSON.parse(savedExam));
        } catch (error) {
          console.error('Error parsing exam state:', error);
        }
      }
      
      if (savedProgress) {
        setExamProgress(Number(savedProgress));
      }
    }
  }, []);

  // Save exam state to localStorage
  useEffect(() => {
    if (currentExam && typeof window !== 'undefined') {
      localStorage.setItem('exam_state', JSON.stringify(currentExam));
    }
  }, [currentExam]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('exam_progress', examProgress.toString());
    }
  }, [examProgress]);

  const handleSetCurrentExam = (exam: any) => {
    setCurrentExam(exam);
  };

  const handleUpdateProgress = (progress: number) => {
    setExamProgress(progress);
  };

  const value: ExamContextType = {
    currentExam,
    examProgress,
    setCurrentExam: handleSetCurrentExam,
    updateProgress: handleUpdateProgress,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}

