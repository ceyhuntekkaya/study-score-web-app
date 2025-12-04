'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContentContextType {
  currentContent: any | null;
  contentProgress: number;
  setCurrentContent: (content: any) => void;
  updateProgress: (progress: number) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [currentContent, setCurrentContent] = useState<any | null>(null);
  const [contentProgress, setContentProgress] = useState(0);

  // Restore content state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedContent = localStorage.getItem('content_state');
      const savedProgress = localStorage.getItem('content_progress');
      
      if (savedContent) {
        try {
          setCurrentContent(JSON.parse(savedContent));
        } catch (error) {
          console.error('Error parsing content state:', error);
        }
      }
      
      if (savedProgress) {
        setContentProgress(Number(savedProgress));
      }
    }
  }, []);

  // Save content state to localStorage
  useEffect(() => {
    if (currentContent && typeof window !== 'undefined') {
      localStorage.setItem('content_state', JSON.stringify(currentContent));
    }
  }, [currentContent]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('content_progress', contentProgress.toString());
    }
  }, [contentProgress]);

  const handleSetCurrentContent = (content: any) => {
    setCurrentContent(content);
  };

  const handleUpdateProgress = (progress: number) => {
    setContentProgress(progress);
  };

  const value: ContentContextType = {
    currentContent,
    contentProgress,
    setCurrentContent: handleSetCurrentContent,
    updateProgress: handleUpdateProgress,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

