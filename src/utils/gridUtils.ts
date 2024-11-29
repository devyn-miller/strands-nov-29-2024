import { Position, Word, Theme } from '../types/game';

export const GRID_ROWS = 6;
export const GRID_COLS = 8;

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export function generateGrid(theme: Theme): string[][] {
  const grid: string[][] = Array(GRID_ROWS).fill(null)
    .map(() => Array(GRID_COLS).fill(''));
  
  // Place theme words first
  const words = [...theme.words, theme.spangram];
  for (const word of words) {
    placeWord(grid, word);
  }
  
  // Fill remaining empty cells
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < GRID_ROWS; i++) {
    for (let j = 0; j < GRID_COLS; j++) {
      if (!grid[i][j]) {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
  
  return grid;
}

function placeWord(grid: string[][], word: string): boolean {
  const attempts = 100;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const startRow = Math.floor(Math.random() * GRID_ROWS);
    const startCol = Math.floor(Math.random() * GRID_COLS);
    
    if (canPlaceWord(grid, word, startRow, startCol, direction)) {
      for (let i = 0; i < word.length; i++) {
        const row = startRow + direction[0] * i;
        const col = startCol + direction[1] * i;
        grid[row][col] = word[i];
      }
      return true;
    }
  }
  return false;
}

function canPlaceWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: number[]
): boolean {
  for (let i = 0; i < word.length; i++) {
    const row = startRow + direction[0] * i;
    const col = startCol + direction[1] * i;
    
    if (!isValidPosition({ row, col })) return false;
    
    const existing = grid[row][col];
    if (existing && existing !== word[i]) return false;
  }
  return true;
}

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < GRID_ROWS && 
         pos.col >= 0 && pos.col < GRID_COLS;
}

export function getWordFromPositions(grid: string[][], positions: Position[]): string {
  return positions.map(pos => grid[pos.row][pos.col]).join('');
}

export function arePositionsAdjacent(pos1: Position, pos2: Position): boolean {
  return DIRECTIONS.some(([dx, dy]) => 
    pos1.row + dx === pos2.row && pos1.col + dy === pos2.col
  );
}

export function findWordInGrid(grid: string[][], word: string): Word | null {
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      for (const [dx, dy] of DIRECTIONS) {
        let found = true;
        let positions: Position[] = [];
        
        for (let i = 0; i < word.length; i++) {
          const newRow = row + dx * i;
          const newCol = col + dy * i;
          
          if (!isValidPosition({ row: newRow, col: newCol }) || 
              grid[newRow][newCol] !== word[i]) {
            found = false;
            break;
          }
          positions.push({ row: newRow, col: newCol });
        }
        
        if (found) {
          return {
            word,
            start: positions[0],
            end: positions[positions.length - 1],
            found: false
          };
        }
      }
    }
  }
  return null;
}

export function isSpangram(word: Word): boolean {
  const touchesLeft = word.start.col === 0 || word.end.col === 0;
  const touchesRight = word.start.col === GRID_COLS - 1 || word.end.col === GRID_COLS - 1;
  const touchesTop = word.start.row === 0 || word.end.row === 0;
  const touchesBottom = word.start.row === GRID_ROWS - 1 || word.end.row === GRID_ROWS - 1;
  
  return (touchesLeft && touchesRight) || (touchesTop && touchesBottom);
}