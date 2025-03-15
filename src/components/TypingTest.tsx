import React, { useState, useEffect, useCallback } from 'react';
import { Word, TypingStats, DifficultyLevel, TypingState } from '../types';
import { wordLists, levelConfigs, specialCharacters } from '../data/words';
import { KeyboardIcon, Timer, Hash, Type, Star } from 'lucide-react';
import { saveResult } from '../utils/storage';

interface TypingTestProps {
  difficulty: DifficultyLevel;
  theme: string;
}

const TypingTest: React.FC<TypingTestProps> = ({ difficulty, theme }) => {
  const [state, setState] = useState<TypingState>({
    currentInput: '',
    words: [],
    startTime: null,
    isActive: false,
    stats: {
      wpm: 0,
      accuracy: 0,
      correctWords: 0,
      totalWords: 0,
      timeElapsed: 0,
      date: new Date().toISOString(),
      difficulty
    },
    timeRemaining: levelConfigs[difficulty].timeLimit,
    includePunctuation: false,
    includeNumbers: false,
    includeSpecial: false
  });

  const generateWords = useCallback(() => {
    const list = [...wordLists[difficulty]];
    
    if (state.includePunctuation) {
      list.push(...specialCharacters.punctuation);
    }
    if (state.includeNumbers) {
      list.push(...specialCharacters.numbers);
    }
    if (state.includeSpecial) {
      list.push(...specialCharacters.special);
    }

    const count = levelConfigs[difficulty].wordCount;
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(word => ({
      text: word,
      status: 'pending' as const
    }));
  }, [difficulty, state.includePunctuation, state.includeNumbers, state.includeSpecial]);

  const resetTest = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentInput: '',
      words: generateWords(),
      startTime: null,
      isActive: false,
      stats: {
        wpm: 0,
        accuracy: 0,
        correctWords: 0,
        totalWords: 0,
        timeElapsed: 0,
        date: new Date().toISOString(),
        difficulty
      },
      timeRemaining: levelConfigs[difficulty].timeLimit
    }));
  }, [generateWords, difficulty]);

  useEffect(() => {
    resetTest();
  }, [difficulty, resetTest]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.isActive && state.timeRemaining > 0) {
      timer = setInterval(() => {
        setState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          if (newTimeRemaining === 0) {
            saveResult(prev.stats);
            clearInterval(timer);
          }
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.isActive, state.timeRemaining]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!state.startTime && value) {
      setState(prev => ({ ...prev, startTime: Date.now(), isActive: true }));
    }

    if (value.endsWith(' ')) {
      const input = value.trim();
      const wordIndex = state.words.findIndex(word => word.status === 'pending');
      
      if (wordIndex !== -1) {
        const newWords = [...state.words];
        newWords[wordIndex].status = input === newWords[wordIndex].text ? 'correct' : 'incorrect';
        
        const correctWords = newWords.filter(word => word.status === 'correct').length;
        const timeElapsed = (Date.now() - (state.startTime || Date.now())) / 1000 / 60;
        const wpm = Math.round(correctWords / timeElapsed);
        const accuracy = Math.round((correctWords / (wordIndex + 1)) * 100);
        const newStats = {
          wpm,
          accuracy,
          correctWords,
          totalWords: wordIndex + 1,
          timeElapsed: Math.round(timeElapsed * 60),
          date: new Date().toISOString(),
          difficulty
        };

        setState(prev => ({
          ...prev,
          currentInput: '',
          words: newWords,
          stats: newStats
        }));

        if (newWords.every(word => word.status !== 'pending')) {
          saveResult(newStats);
        }
      }
    } else {
      setState(prev => ({ ...prev, currentInput: value }));
    }
  };

  const toggleCharacterSet = (type: 'punctuation' | 'numbers' | 'special') => {
    setState(prev => {
      const updates = {
        includePunctuation: type === 'punctuation' ? !prev.includePunctuation : prev.includePunctuation,
        includeNumbers: type === 'numbers' ? !prev.includeNumbers : prev.includeNumbers,
        includeSpecial: type === 'special' ? !prev.includeSpecial : prev.includeSpecial
      };
      return { ...prev, ...updates };
    });
    resetTest();
  };

  const themeClasses = {
    light: 'bg-white text-gray-800',
    dark: 'bg-gray-800 text-white',
    purple: 'bg-purple-900 text-white'
  };

  const cardThemeClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-700',
    purple: 'bg-purple-800'
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 rounded-lg shadow-lg transition-colors duration-200 ${themeClasses[theme]}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <KeyboardIcon className="w-6 h-6" />
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
        </h2>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-sm opacity-80">WPM</p>
            <p className="text-xl font-bold text-indigo-500">{state.stats.wpm}</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80">Accuracy</p>
            <p className="text-xl font-bold text-green-500">{state.stats.accuracy}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80">Time</p>
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              <p className="text-xl font-bold text-orange-500">{state.timeRemaining}s</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => toggleCharacterSet('punctuation')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            state.includePunctuation
              ? 'bg-indigo-600 text-white'
              : `${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'}`
          }`}
        >
          <Type className="w-4 h-4" />
          Punctuation
        </button>
        <button
          onClick={() => toggleCharacterSet('numbers')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            state.includeNumbers
              ? 'bg-indigo-600 text-white'
              : `${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'}`
          }`}
        >
          <Hash className="w-4 h-4" />
          Numbers
        </button>
        <button
          onClick={() => toggleCharacterSet('special')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            state.includeSpecial
              ? 'bg-indigo-600 text-white'
              : `${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'}`
          }`}
        >
          <Star className="w-4 h-4" />
          Special
        </button>
      </div>

      <div className={`mb-6 p-4 rounded-lg ${cardThemeClasses[theme]}`}>
        <div className="flex flex-wrap gap-2">
          {state.words.map((word, index) => (
            <span
              key={index}
              className={`text-lg ${
                word.status === 'correct'
                  ? 'text-green-500'
                  : word.status === 'incorrect'
                  ? 'text-red-500'
                  : ''
              }`}
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={state.currentInput}
          onChange={handleInput}
          className={`flex-1 p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 
            theme === 'purple' ? 'bg-purple-800 border-purple-700' : 
            'bg-white border-gray-300'
          }`}
          placeholder="Start typing..."
          disabled={state.timeRemaining === 0 || state.words.every(word => word.status !== 'pending')}
        />
        <button
          onClick={resetTest}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TypingTest;