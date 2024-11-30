import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { RefreshCw, ChevronRight } from 'lucide-react';
import { themes } from '../utils/themes';

interface GameControlsProps {
  onNewPuzzle: (themeName?: string) => void;
  onResetPuzzle: () => void;
  onGiveUp: () => void;
  isComplete: boolean;
  gameState: GameState;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewPuzzle,
  onResetPuzzle,
  onGiveUp,
  isComplete,
  gameState
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const handleShare = () => {
    const { theme, foundWords, themeWords, spangram } = gameState;
    const totalWords = themeWords.length;
    const foundCount = foundWords.size;
    const hasSpangram = spangram && foundWords.has(spangram.word);
    
    const shareText = `Strands - ${theme.name}\n` +
      `${foundCount}/${totalWords} words found\n` +
      `${hasSpangram ? '🌟 Spangram found!' : ''}\n` +
      `Play at: https://yourwebsite.com/strands`;

    if (navigator.share) {
      navigator.share({
        title: 'Strands Word Game',
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          setShareMessage('Results copied to clipboard!');
          setTimeout(() => setShareMessage(null), 2000);
        })
        .catch(console.error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4 justify-center">
        <button
          onClick={onResetPuzzle}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Reset puzzle"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Reset
        </button>
        
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Show answer"
        >
          Show Answer
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 id="confirm-dialog-title" className="text-lg font-medium text-gray-900 mb-4">Are you sure?</h3>
            <p className="text-sm text-gray-500 mb-4">
              This will reveal all remaining words and end the current game.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Cancel showing answer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onGiveUp();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                aria-label="Confirm show answer"
              >
                Show Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {shareMessage && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg" role="alert">
          {shareMessage}
        </div>
      )}
    </div>
  );
};