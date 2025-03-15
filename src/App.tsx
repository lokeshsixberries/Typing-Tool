import React, { useState } from 'react';
import { DifficultyLevel, Theme } from './types';
import TypingTest from './components/TypingTest';
import PerformanceHistory from './components/PerformanceHistory';
import { levelConfigs } from './data/words';
import { KeyboardIcon, Trophy, Target, Rocket, Sun, Moon, Palette } from 'lucide-react';

function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [theme, setTheme] = useState<Theme>('light');

  const difficultyIcons = {
    beginner: <Target className="w-6 h-6" />,
    intermediate: <Trophy className="w-6 h-6" />,
    experienced: <Rocket className="w-6 h-6" />
  };

  const themeClasses = {
    light: 'bg-gray-100',
    dark: 'bg-gray-900',
    purple: 'bg-purple-950'
  };

  const headerThemeClasses = {
    light: 'bg-white shadow-sm',
    dark: 'bg-gray-800 shadow-sm',
    purple: 'bg-purple-900 shadow-purple-800/50'
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses[theme]}`}>
      <header className={`${headerThemeClasses[theme]} transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyboardIcon className="w-8 h-8 text-indigo-600" />
              <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                TypeMaster
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-lg ${theme === 'light' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-white'}`}
              >
                <Sun className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-white'}`}
              >
                <Moon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme('purple')}
                className={`p-2 rounded-lg ${theme === 'purple' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-white'}`}
              >
                <Palette className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {(Object.keys(levelConfigs) as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`p-6 rounded-lg shadow-md transition-all ${
                difficulty === level
                  ? 'bg-indigo-600 text-white transform scale-105'
                  : `${theme === 'light' ? 'bg-white text-gray-800' : 
                      theme === 'dark' ? 'bg-gray-800 text-white' : 
                      'bg-purple-900 text-white'} hover:bg-opacity-90`
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {difficultyIcons[level]}
                <h2 className="text-xl font-semibold capitalize">{level}</h2>
              </div>
              <p className={`text-sm ${difficulty === level ? 'text-indigo-100' : 'opacity-80'}`}>
                {levelConfigs[level].description}
              </p>
            </button>
          ))}
        </div>

        <TypingTest difficulty={difficulty} theme={theme} />
        <PerformanceHistory theme={theme} />
      </main>
    </div>
  );
}

export default App;