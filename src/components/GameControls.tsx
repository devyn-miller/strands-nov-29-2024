import React from 'react';
import { RefreshCw, ChevronRight } from 'lucide-react';

interface GameControlsProps {
  onNewPuzzle: () => void;
  onResetPuzzle: () => void;
  isComplete: boolean;
}

export function GameControls({ onNewPuzzle, onResetPuzzle, isComplete }: GameControlsProps) {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      <button
        onClick={onResetPuzzle}
        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reset Puzzle
      </button>
      
      {isComplete && (
        <button
          onClick={onNewPuzzle}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-2" />
          Next Puzzle
        </button>
      )}
    </div>
  );
}