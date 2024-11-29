import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { WordList } from './components/WordList';
import { GameStats } from './components/GameStats';
import { GameControls } from './components/GameControls';
import { ThemeSearch } from './components/ThemeSearch';
import { HintSystem } from './components/HintSystem';
import { generateGrid, findWordInGrid, getWordFromPositions } from './utils/gridUtils';
import { updateGameStateWithFoundWord } from './utils/gameUtils';
import { generatePuzzleTheme } from './services/geminiApi';
import { Position, GameState } from './types/game';
import { useWordSelection } from './hooks/useWordSelection';
import { isValidWord } from './utils/wordUtils';

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
        activeHintWord: null,
        nonThemeWords: new Set<string>()
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
    
    // Check if it's a theme word
    if (gameState.themeWords.some(w => w.word === word && !gameState.foundWords.has(word))) {
      const newFoundWords = new Set(gameState.foundWords).add(word);
      const newHighlightedCells = new Set(highlightedCells);
      
      positions.forEach(pos => newHighlightedCells.add(`${pos.row},${pos.col}`));
      
      setGameState(prev => prev ? ({
        ...prev,
        foundWords: newFoundWords,
        activeHintWord: null // Clear any active hint when a word is found
      }) : null);
      setHighlightedCells(newHighlightedCells);
    } 
    // Check if it's the spangram
    else if (gameState.spangram && word === gameState.spangram.word) {
      const newSpangramCells = new Set<string>();
      positions.forEach(pos => newSpangramCells.add(`${pos.row},${pos.col}`));
      setSpangramCells(newSpangramCells);
    }
    // Check if it's a valid non-theme word
    else if (isValidWord(word) && !gameState.nonThemeWords.has(word)) {
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
    
    resetSelection();
  }, [gameState, highlightedCells, resetSelection]);

  const handleRequestHint = useCallback(() => {
    if (!gameState || gameState.hints === 0 || gameState.activeHintWord) return;

    // Find a random unfound theme word
    const unfoundWords = gameState.themeWords.filter(w => !gameState.foundWords.has(w.word));
    if (unfoundWords.length === 0) return;

    const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    
    setGameState(prev => prev ? ({
      ...prev,
      hints: prev.hints - 1,
      activeHintWord: randomWord
    }) : null);
  }, [gameState]);

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
          <p className="text-xl text-gray-600 mb-4">Theme: {gameState.theme.name}</p>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">How to Play</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Word Selection:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Click and drag to select adjacent letters</li>
                  <li>Letters must be connected horizontally, vertically, or diagonally</li>
                  <li>Words can be spelled forwards or backwards</li>
                  <li>Each letter in the grid is used exactly once across all words</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Controls:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> or click Submit to check your word</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Backspace</kbd> to remove the last letter</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to clear your selection</li>
                  <li>Click any selected letter to unselect back to that point</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 text-left">
              <h3 className="font-medium text-gray-700 mb-2">Special Words:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Find the special "spangram" word that uses unique letters!</li>
                <li>All theme words are related to: {gameState.theme.description}</li>
                <li>Found words will be highlighted on the grid</li>
              </ul>
            </div>
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

        <div className="mt-6">
          <HintSystem 
            gameState={gameState}
            onRequestHint={handleRequestHint}
          />
        </div>
      </div>
    </div>
  );
}

export default App;