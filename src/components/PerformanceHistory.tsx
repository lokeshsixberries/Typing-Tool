import React from 'react';
import { TypingStats } from '../types';
import { getHistory } from '../utils/storage';
import { Trophy, Clock, Target } from 'lucide-react';

interface PerformanceHistoryProps {
  theme: string;
}

const PerformanceHistory: React.FC<PerformanceHistoryProps> = ({ theme }) => {
  const history = getHistory();
  
  const themeClasses = {
    light: 'bg-white text-gray-800',
    dark: 'bg-gray-800 text-white',
    purple: 'bg-purple-900 text-white'
  };

  if (history.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`mt-8 p-6 rounded-lg shadow-lg ${themeClasses[theme]}`}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Performance History
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' :
              theme === 'purple' ? 'bg-purple-800' :
              'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="capitalize font-medium">{stat.difficulty}</span>
              <span className="text-sm opacity-75 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(stat.date)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-75">WPM</p>
                <p className="text-xl font-bold text-blue-500">{stat.wpm}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Accuracy</p>
                <p className="text-xl font-bold text-green-500">{stat.accuracy}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceHistory;