'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LearnerContentType } from '@/types';
import { LEARNER_ROUTES } from '@/constants';
import { useRouter } from 'next/navigation';

interface LearnerContextType {
  currentContentType: LearnerContentType | null;
  setContentType: (type: LearnerContentType) => void;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [currentContentType, setCurrentContentType] = useState<LearnerContentType | null>(null);
  const router = useRouter();

  // Restore content type from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/learner/quiz')) {
        setCurrentContentType('quiz');
      } else if (path.includes('/learner/exam')) {
        setCurrentContentType('exam');
      } else if (path.includes('/learner/content')) {
        setCurrentContentType('content');
      } else if (path.includes('/learner/dashboard')) {
        setCurrentContentType('dashboard');
      }
    }
  }, []);

  const handleSetContentType = (type: LearnerContentType) => {
    setCurrentContentType(type);
    const route = LEARNER_ROUTES[type];
    if (route) {
      router.push(route);
    }
  };

  const value: LearnerContextType = {
    currentContentType,
    setContentType: handleSetContentType,
  };

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (context === undefined) {
    throw new Error('useLearner must be used within a LearnerProvider');
  }
  return context;
}

