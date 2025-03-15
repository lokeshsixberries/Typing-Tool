export interface Word {
  text: string;
  status: 'pending' | 'correct' | 'incorrect';
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctWords: number;
  totalWords: number;
  timeElapsed: number;
  date: string;
  difficulty: DifficultyLevel;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'experienced';

export interface LevelConfig {
  name: DifficultyLevel;
  wordCount: number;
  timeLimit: number;
  description: string;
}

export interface TypingState {
  currentInput: string;
  words: Word[];
  startTime: number | null;
  isActive: boolean;
  stats: TypingStats;
  timeRemaining: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
  includeSpecial: boolean;
}

export type Theme = 'light' | 'dark' | 'purple';