import React from 'react';
import { Trophy, Lightbulb, RotateCcw } from 'lucide-react';

interface GameStatsProps {
  hints: number;
  foundWords: Set<string>;
  totalWords: number;
  isComplete: boolean;
  onUseHint: () => void;
  onResetSelection: () => void;
}

export function GameStats({
  hints,
  foundWords,
  totalWords,
  isComplete,
  onUseHint,
  onResetSelection
}: GameStatsProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mt-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="font-bold">{foundWords.size}/{totalWords} words found</span>
        </div>
        <div className="flex items-center">
          <Lightbulb className="w-5 h-5 text-purple-500 mr-2" />
          <span className="font-bold">{hints} hints available</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onResetSelection}
          className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onUseHint}
          disabled={hints === 0 || isComplete}
          className={`px-4 py-2 rounded-lg ${
            hints > 0 && !isComplete
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Use Hint
        </button>
      </div>
    </div>
  );
}