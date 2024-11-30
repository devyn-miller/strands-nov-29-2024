import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { GameStats } from './components/GameStats';
import { GameControls } from './components/GameControls';
import { HintSystem } from './components/HintSystem';
import { generateGrid, findWordInGrid, getWordFromPositions } from './utils/gridUtils';
import { generateThemeWords, getWordDefinition } from './services/dictionaryApi';
import { themes } from './utils/themes';
import { GameState, Theme, Position } from './types/game';
import { useWordSelection } from './hooks/useWordSelection';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [spangramCells, setSpangramCells] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const { selectedPositions, handleCellClick, resetSelection } = useWordSelection();

  const initializeGame = useCallback(async (themeName: string = 'random') => {
    let selectedTheme: Theme;
    if (themeName === 'random') {
      const randomIndex = Math.floor(Math.random() * themes.length);
      selectedTheme = themes[randomIndex];
    } else {
      selectedTheme = themes.find(t => t.name === themeName) || themes[0];
    }

    return {
      theme: selectedTheme,
      foundWords: new Set<string>(),
      themeWords: selectedTheme.words,
      spangram: selectedTheme.spangram,
      grid: generateGrid(selectedTheme),
      nonThemeWords: new Set<string>(),
      hints: 3,
      activeHintWord: null,
      isComplete: false
    };
  }, []);

  // Check if a word exists in the dictionary
  const isValidWord = useCallback(async (word: string): Promise<boolean> => {
    try {
      await getWordDefinition(word);
      return true;
    } catch {
      return false;
    }
  }, []);

  const checkWord = useCallback(async (positions: Position[]) => {
    if (!gameState || positions.length < 4) return;

    const word = getWordFromPositions(gameState.grid, positions);
    
    // Check if it's a theme word
    if (gameState.themeWords.includes(word) && !gameState.foundWords.has(word)) {
      const newFoundWords = new Set(gameState.foundWords).add(word);
      const newHighlightedCells = new Set(highlightedCells);
      
      positions.forEach(pos => newHighlightedCells.add(`${pos.row},${pos.col}`));
      
      setGameState(prev => prev ? ({
        ...prev,
        foundWords: newFoundWords,
        activeHintWord: null
      }) : null);
      setHighlightedCells(newHighlightedCells);
    } 
    // Check if it's the spangram
    else if (gameState.spangram && word === gameState.spangram && !gameState.foundWords.has(word)) {
      const newFoundWords = new Set(gameState.foundWords).add(word);
      const newSpangramCells = new Set<string>();
      positions.forEach(pos => newSpangramCells.add(`${pos.row},${pos.col}`));
      setSpangramCells(newSpangramCells);
      setGameState(prev => prev ? ({
        ...prev,
        foundWords: newFoundWords
      }) : null);
    }
    // Check if it's a valid non-theme word
    else if (word.length >= 4 && !gameState.foundWords.has(word) && !gameState.nonThemeWords.has(word)) {
      const isValid = await isValidWord(word);
      if (isValid) {
        setGameState(prev => {
          if (!prev) return null;
          const newNonThemeWords = new Set(prev.nonThemeWords).add(word);
          // Award a hint for every 3 non-theme words found
          const newHints = Math.floor(newNonThemeWords.size / 3);
          return {
            ...prev,
            nonThemeWords: newNonThemeWords,
            hints: newHints
          };
        });
      }
    }
    
    resetSelection();
    setInput('');
  }, [gameState, highlightedCells, resetSelection, isValidWord]);

  useEffect(() => {
    const handleSubmitWord = (e: CustomEvent<Position[]>) => {
      void checkWord(e.detail);
    };

    window.addEventListener('submitWord', handleSubmitWord as EventListener);
    return () => window.removeEventListener('submitWord', handleSubmitWord as EventListener);
  }, [checkWord]);

  useEffect(() => {
    initializeGame().then(setGameState);
  }, [initializeGame]);

  const handleNewPuzzle = async (themeName?: string) => {
    const newGameState = await initializeGame(themeName || 'random');
    setGameState(newGameState);
    setHighlightedCells(new Set());
    setSpangramCells(new Set());
    resetSelection();
    setInput('');
  };

  const handleGiveUp = useCallback(() => {
    if (!gameState) return;

    // Reveal all theme words
    const newHighlightedCells = new Set<string>();
    const newFoundWords = new Set(gameState.foundWords);

    // Add all theme words to found words
    gameState.themeWords.forEach(word => {
      newFoundWords.add(word);
    });

    setGameState(prev => prev ? ({
      ...prev,
      foundWords: newFoundWords,
      isComplete: true,
      activeHintWord: null
    }) : null);
    setHighlightedCells(newHighlightedCells);
  }, [gameState]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPositions.length > 0) {
      const event = new CustomEvent('submitWord', { 
        detail: selectedPositions 
      });
      window.dispatchEvent(event);
    }
  }, [selectedPositions]);

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Strands</h1>
                  <p className="text-gray-500">Find all the words related to today's theme!</p>
                </div>

                <div className="mb-6">
                  <select
                    value={gameState.theme.name}
                    onChange={(e) => handleNewPuzzle(e.target.value)}
                    className="w-full px-4 py-2 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Select theme"
                  >
                    <option value="random">Random Theme</option>
                    {themes.map((theme) => (
                      <option key={theme.name} value={theme.name}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <Grid
                    grid={gameState.grid}
                    selectedPositions={selectedPositions}
                    onCellClick={handleCellClick}
                    highlightedCells={highlightedCells}
                    spangramCells={spangramCells}
                  />
                </div>

                <div className="mt-4">
                  <GameStats
                    foundWords={gameState.foundWords}
                    totalWords={gameState.themeWords.length}
                    theme={gameState.theme}
                    spangram={gameState.spangram}
                    nonThemeWords={gameState.nonThemeWords}
                    hints={gameState.hints}
                  />
                </div>

                <div className="mt-4">
                  <GameControls
                    onNewPuzzle={handleNewPuzzle}
                    onResetPuzzle={() => {
                      if (gameState) {
                        setHighlightedCells(new Set());
                        setSpangramCells(new Set());
                        resetSelection();
                        setInput('');
                        setGameState({
                          ...gameState,
                          foundWords: new Set(),
                          nonThemeWords: new Set(),
                          hints: 3,
                          isComplete: false
                        });
                      }
                    }}
                    onGiveUp={handleGiveUp}
                    isComplete={gameState.isComplete}
                    gameState={gameState}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;