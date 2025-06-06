
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface StudyProgressData {
  area: string;
  themes: string[];
  currentIndex: number;
  lastStudied: string;
  totalCards: number;
  completed: boolean;
}

export const useStudyProgress = (area: string, themes: string[]) => {
  const progressKey = `study-progress-${area}-${themes.sort().join('-')}`;
  const [progress, setProgress] = useLocalStorage<StudyProgressData | null>(progressKey, null);

  const hasValidProgress = () => {
    if (!progress) return false;
    if (progress.completed) return false;
    if (progress.area !== area) return false;
    if (progress.themes.sort().join('-') !== themes.sort().join('-')) return false;
    
    // Check if progress is not too old (7 days)
    const lastStudied = new Date(progress.lastStudied);
    const now = new Date();
    const daysDiff = (now.getTime() - lastStudied.getTime()) / (1000 * 3600 * 24);
    
    return daysDiff <= 7 && progress.currentIndex > 0;
  };

  const saveProgress = (currentIndex: number, totalCards: number) => {
    setProgress({
      area,
      themes,
      currentIndex,
      lastStudied: new Date().toISOString(),
      totalCards,
      completed: false
    });
  };

  const markCompleted = () => {
    if (progress) {
      setProgress({
        ...progress,
        completed: true
      });
    }
  };

  const clearProgress = () => {
    setProgress(null);
  };

  const getStartIndex = () => {
    return hasValidProgress() ? progress!.currentIndex : 0;
  };

  return {
    hasProgress: hasValidProgress(),
    progress,
    saveProgress,
    markCompleted,
    clearProgress,
    getStartIndex
  };
};
