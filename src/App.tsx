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
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [spangramCells, setSpangramCells] = useState<Set<string>>(new Set());
  const { selectedPositions, handleCellClick, resetSelection } = useWordSelection();

  const initializeGame = useCallback(async (keyword?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const theme = keyword 
        ? await generatePuzzleTheme(keyword)
        : await generatePuzzleTheme('celestial');
      
      console.log('Theme received:', theme);
      const grid = generateGrid(theme);
      console.log('Grid generated:', grid);
      const themeWords = theme.words
        .map(word => findWordInGrid(grid, word))
        .filter((word): word is NonNullable<typeof word> => word !== null);
      console.log('Theme words placed:', themeWords);
      const spangram = findWordInGrid(grid, theme.spangram);
      console.log('Spangram placed:', spangram);

      const newGameState = {
        grid,
        theme,
        themeWords,
        spangram,
        foundWords: new Set<string>(),
        hints: 0,
        isComplete: false,
        activeHintWord: null
      };
      console.log('New game state:', newGameState);
      return newGameState;
    } catch (err) {
      setError('Failed to generate puzzle. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    }
    
    resetSelection();
  }, [gameState, highlightedCells, resetSelection]);

  useEffect(() => {
    const handleSubmitWord = (e: CustomEvent<Position[]>) => {
      checkWord(e.detail);
    };

    window.addEventListener('submitWord', handleSubmitWord as EventListener);
    return () => window.removeEventListener('submitWord', handleSubmitWord as EventListener);
  }, [checkWord]);

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

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Word Search</h1>
          <p className="text-xl text-gray-600">Theme: {gameState.theme.name}</p>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>Click letters to select a word (must be adjacent)</p>
            <p>Press Enter or click Submit to check your word</p>
            <p>Press Backspace to remove the last letter</p>
            <p>Click a selected letter to unselect it</p>
            <p>Press Escape to clear selection</p>
          </div>
        </div>

        <ThemeSearch onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <Grid
            grid={gameState.grid}
            selectedPositions={selectedPositions}
            onCellClick={handleCellClick}
            highlightedCells={highlightedCells}
            spangramCells={spangramCells}
          />
        </div>

        <div className="mt-6">
          <WordList
            theme={gameState.theme}
            foundWords={gameState.foundWords}
            spangram={gameState.spangram}
          />
        </div>

        <div className="mt-6">
          <GameStats
            foundWords={gameState.foundWords}
            totalWords={gameState.themeWords.length}
          />
        </div>

        <div className="mt-6">
          <GameControls
            onNewGame={() => handleSearch(gameState.theme.name)}
            onReset={() => {
              setHighlightedCells(new Set());
              setSpangramCells(new Set());
              resetSelection();
              setGameState(prev => prev ? {...prev, foundWords: new Set()} : null);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;