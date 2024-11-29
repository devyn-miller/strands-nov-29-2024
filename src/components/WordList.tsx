import React from 'react';
import { Word, Theme } from '../types/game';

interface WordListProps {
  theme: Theme;
  foundWords: Set<string>;
  spangram: Word | null;
}

export function WordList({ theme, foundWords, spangram }: WordListProps) {
  if (!theme || !theme.words) return null;

  return (
    <div className="mt-4 p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-3">Theme Words</h2>
      <div className="grid grid-cols-2 gap-2">
        {theme.words.map((word) => {
          const isFound = foundWords.has(word);
          
          return (
            <div
              key={word}
              className={`p-2 rounded ${
                isFound ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
              }`}
            >
              {isFound ? word : '•'.repeat(word.length)}
            </div>
          );
        })}
        {spangram && (
          <div
            className={`p-2 rounded col-span-2 text-center ${
              foundWords.has(spangram.word) ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600'
            }`}
          >
            {foundWords.has(spangram.word) ? spangram.word : '•'.repeat(spangram.word.length)}
          </div>
        )}
      </div>
    </div>
  );
}