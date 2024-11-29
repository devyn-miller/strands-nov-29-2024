import React from 'react';
import { Word } from '../types/game';

interface WordListProps {
  themeWords: Word[];
  foundWords: Set<string>;
  activeHintWord: string | null;
}

export function WordList({ themeWords, foundWords, activeHintWord }: WordListProps) {
  return (
    <div className="mt-4 p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-3">Theme Words</h2>
      <div className="grid grid-cols-2 gap-2">
        {themeWords.map((word) => {
          const isFound = foundWords.has(word.word);
          const isHinted = activeHintWord === word.word;
          
          return (
            <div
              key={word.word}
              className={`p-2 rounded ${
                isFound ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
              }`}
            >
              {isHinted
                ? word.word.split('').map((letter, i) => (
                    <span
                      key={i}
                      className={i <= word.word.length / 2 ? 'text-blue-600' : 'text-gray-400'}
                    >
                      {letter}
                    </span>
                  ))
                : isFound
                ? word.word
                : '•'.repeat(word.word.length)}
            </div>
          );
        })}
      </div>
    </div>
  );
}