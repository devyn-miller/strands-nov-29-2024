import React from 'react';
import { WordLocation, GameState } from '../types/game';

interface HintSystemProps {
  gameState: GameState;
  onRequestHint: () => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({ gameState, onRequestHint }) => {
  const { hints, nonThemeWords, activeHintWord, foundWords, themeWords } = gameState;
  const wordsNeededForNextHint = 3 - (nonThemeWords.size % 3);
  const totalThemeWords = themeWords.length;
  const foundThemeWords = foundWords.size;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-semibold">
          {foundThemeWords} of {totalThemeWords} theme words found
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Hints: {hints}</span>
          <button
            onClick={onRequestHint}
            disabled={hints === 0 || activeHintWord !== null}
            className={`px-4 py-2 rounded-md ${
              hints === 0 || activeHintWord !== null
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Use Hint
          </button>
        </div>
      </div>

      {activeHintWord && (
        <div className="bg-yellow-50 p-3 rounded-md">
          <p className="text-sm font-medium text-yellow-800 mb-1">
            Hint Active: Unscramble these letters to find a theme word
          </p>
          <div className="flex space-x-2">
            {activeHintWord.word.split('').sort(() => Math.random() - 0.5).map((letter, index) => (
              <span
                key={index}
                className="w-8 h-8 flex items-center justify-center bg-yellow-200 rounded-md text-yellow-900 font-bold"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      )}

      {hints === 0 && !activeHintWord && (
        <div className="text-sm text-gray-600">
          Find {wordsNeededForNextHint} more non-theme {wordsNeededForNextHint === 1 ? 'word' : 'words'} to earn a hint!
        </div>
      )}
    </div>
  );
};
