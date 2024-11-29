import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { WordList } from './components/WordList';
import { GameStats } from './components/GameStats';
import { GameControls } from './components/GameControls';
import { ThemeSearch } from './components/ThemeSearch';
import { generateGrid, findWordInGrid, getWordFromPositions } from './utils/gridUtils';
import { updateGameStateWithFoundWord } from './utils/gameUtils';
import { generatePuzzleTheme } from './services/geminiApi';
import { Position, GameState } from './types/game';
import { useWordSelection } from './hooks/useWordSelection';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeGame = useCallback(async (keyword?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const theme = keyword 
        ? await generatePuzzleTheme(keyword)
        : await generatePuzzleTheme('celestial');
      
      const grid = generateGrid(theme);
      const themeWords = theme.words
        .map(word => findWordInGrid(grid, word))
        .filter((word): word is NonNullable<typeof word> => word !== null);
      const spangram = findWordInGrid(grid, theme.spangram);

      return {
        grid,
        theme,
        themeWords,
        spangram,
        foundWords: new Set<string>(),
        hints: 0,
        isComplete: false,
        activeHintWord: null
      };
    } catch (err) {
      setError('Failed to generate puzzle. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [spangramCells, setSpangramCells] = useState<Set<string>>(new Set());
  const { selectedPositions, handleCellClick, resetSelection } = useWordSelection();

  useEffect(() => {
    initializeGame().then(setGameState);
  }, [initializeGame]);

  const handleSearch = async (keyword: string) => {
    try {
      const newGameState = await initializeGame(keyword);
      setGameState(newGameState);
      setHighlightedCells(new Set());
      setSpangramCells(new Set());
      resetSelection();
    } catch (err) {
      console.error('Failed to generate new puzzle:', err);
    }
  };

  const checkWord = useCallback((positions: Position[]) => {
    if (!gameState || positions.length < 3) return;

    const word = getWordFromPositions(gameState.grid, positions);
    
    if (gameState.themeWords.some(w => w.word === word && !gameState.foundWords.has(word))) {
      const newFoundWords = new Set(gameState.foundWords).add(word);
      const newHighlightedCells = new Set(highlightedCells);
      
      positions.forEach(pos => newHighlightedCells.add(`${pos.row},${pos.col}`));
      
      setGameState(prev => prev ? ({
        ...prev,
        foundWords: newFoundWords
      }) : null);
      setHighlightedCells(newHighlightedCells);
    } else if (gameState.spangram && word === gameState.spangram.word) {
      const newSpangramCells = new Set<string>();
      positions.forEach(pos => newSpangramCells.add(`${pos.row},${pos.col}`));
      setSpangramCells(newSpangramCells);
    } else {
      setGameState(prev => prev ? updateGameStateWithFoundWord(prev, word, positions) : null);
    }
    
    resetSelection();
  }, [gameState, highlightedCells, resetSelection]);

  // ... rest of the component implementation remains the same ...

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Word Search</h1>
          <p className="text-xl text-gray-600">Theme: {gameState.theme.name}</p>
        </div>

        <ThemeSearch onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* ... rest of the JSX remains the same ... */}
      </div>
    </div>
  );
}

export default App;