import { TypingStats } from '../types';

const STORAGE_KEY = 'typing_history';
const DAYS_TO_KEEP = 7;

export const saveResult = (stats: TypingStats) => {
  const history = getHistory();
  const newHistory = [...history, { ...stats, date: new Date().toISOString() }];
  
  // Clean up old entries
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_KEEP);
  
  const cleanedHistory = newHistory.filter(entry => 
    new Date(entry.date) > cutoffDate
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedHistory));
};

export const getHistory = (): TypingStats[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};