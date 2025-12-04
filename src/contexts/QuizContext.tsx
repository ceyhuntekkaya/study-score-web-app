'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface QuizContextType {
  currentQuiz: any | null;
  quizProgress: number;
  setCurrentQuiz: (quiz: any) => void;
  updateProgress: (progress: number) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [currentQuiz, setCurrentQuiz] = useState<any | null>(null);
  const [quizProgress, setQuizProgress] = useState(0);

  // Restore quiz state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuiz = localStorage.getItem('quiz_state');
      const savedProgress = localStorage.getItem('quiz_progress');
      
      if (savedQuiz) {
        try {
          setCurrentQuiz(JSON.parse(savedQuiz));
        } catch (error) {
          console.error('Error parsing quiz state:', error);
        }
      }
      
      if (savedProgress) {
        setQuizProgress(Number(savedProgress));
      }
    }
  }, []);

  // Save quiz state to localStorage
  useEffect(() => {
    if (currentQuiz && typeof window !== 'undefined') {
      localStorage.setItem('quiz_state', JSON.stringify(currentQuiz));
    }
  }, [currentQuiz]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quiz_progress', quizProgress.toString());
    }
  }, [quizProgress]);

  const handleSetCurrentQuiz = (quiz: any) => {
    setCurrentQuiz(quiz);
  };

  const handleUpdateProgress = (progress: number) => {
    setQuizProgress(progress);
  };

  const value: QuizContextType = {
    currentQuiz,
    quizProgress,
    setCurrentQuiz: handleSetCurrentQuiz,
    updateProgress: handleUpdateProgress,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

