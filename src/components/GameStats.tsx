import React from 'react';
import { Theme } from '../types/game';
import { Trophy, Lightbulb } from 'lucide-react';

interface GameStatsProps {
  foundWords: Set<string>;
  totalWords: number;
  theme: Theme;
  spangram: string;
  nonThemeWords: Set<string>;
  hints: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  foundWords,
  totalWords,
  theme,
  spangram,
  nonThemeWords,
  hints
}) => {
  const foundCount = foundWords.size;
  const hasSpangram = spangram && foundWords.has(spangram);
  const wordsUntilNextHint = 3 - (nonThemeWords.size % 3);
  const showHintProgress = wordsUntilNextHint !== 3;

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-lg font-medium">
            {foundCount}/{totalWords} words found
          </span>
        </div>
        {hasSpangram && (
          <div className="text-yellow-500 font-medium">
            🌟 Spangram found!
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-500" />
          <div className="flex flex-col">
            <span className="text-lg font-medium">
              {hints} hints available
            </span>
            {showHintProgress && (
              <span className="text-sm text-gray-500">
                {wordsUntilNextHint} more {wordsUntilNextHint === 1 ? 'word' : 'words'} until next hint
              </span>
            )}
          </div>
        </div>
        {nonThemeWords.size > 0 && (
          <div className="text-sm text-gray-500">
            Found {nonThemeWords.size} bonus {nonThemeWords.size === 1 ? 'word' : 'words'}
          </div>
        )}
      </div>
    </div>
  );
};