import { GameState, Position, Word } from '../types/game';

export function isValidWord(word: string): boolean {
  return word.length >= 3;
}

export function checkDoubleTap(
  lastTapTime: number | null,
  currentTime: number,
  position: Position,
  lastTapPosition: Position | null
): boolean {
  const doubleTapDelay = 300; // milliseconds
  
  if (!lastTapTime || !lastTapPosition) return false;
  
  const isSamePosition = 
    position.row === lastTapPosition.row && 
    position.col === lastTapPosition.col;
  
  return isSamePosition && (currentTime - lastTapTime) < doubleTapDelay;
}

export function updateGameStateWithFoundWord(
  gameState: GameState,
  word: string,
  positions: Position[]
): GameState {
  const isThemeWord = gameState.themeWords.some(w => w.word === word);
  const isSpangramWord = gameState.spangram?.word === word;
  
  if (!isThemeWord && !isSpangramWord && isValidWord(word)) {
    // Found a valid non-theme word
    const newFoundWords = new Set(gameState.foundWords).add(word);
    const earnedHint = newFoundWords.size % 3 === 0;
    
    return {
      ...gameState,
      foundWords: newFoundWords,
      hints: gameState.hints + (earnedHint ? 1 : 0)
    };
  }
  
  return gameState;
}