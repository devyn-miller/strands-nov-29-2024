import { Position, Word, Theme } from '../types/game';

export const GRID_ROWS = 8;
export const GRID_COLS = 12;
const GRID_SIZE = { rows: GRID_ROWS, cols: GRID_COLS };

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],  // Up-left, Up, Up-right
  [0, -1],           [0, 1],   // Left, Right
  [1, -1],  [1, 0],  [1, 1]    // Down-left, Down, Down-right
];

export function generateGrid(theme: Theme): string[][] {
  const grid: string[][] = Array(GRID_SIZE.rows).fill(null)
    .map(() => Array(GRID_SIZE.cols).fill(''));

  // Place spangram first
  const spangram = theme.spangram;
  let spangramPlaced = false;

  // Try to place spangram horizontally first (connecting left to right)
  for (let row = 0; row < GRID_SIZE.rows && !spangramPlaced; row++) {
    if (canPlaceWord(grid, spangram, row, 0, 0, 1)) {
      placeWord(grid, spangram, row, 0, 0, 1);
      spangramPlaced = true;
    }
  }

  // If horizontal placement failed, try vertical (connecting top to bottom)
  if (!spangramPlaced) {
    for (let col = 0; col < GRID_SIZE.cols && !spangramPlaced; col++) {
      if (canPlaceWord(grid, spangram, 0, col, 1, 0)) {
        placeWord(grid, spangram, 0, col, 1, 0);
        spangramPlaced = true;
      }
    }
  }

  // Place theme words
  theme.words.forEach(word => {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const row = Math.floor(Math.random() * GRID_SIZE.rows);
      const col = Math.floor(Math.random() * GRID_SIZE.cols);
      const dirIndex = Math.floor(Math.random() * DIRECTIONS.length);
      const [dRow, dCol] = DIRECTIONS[dirIndex];

      if (canPlaceWord(grid, word, row, col, dRow, dCol)) {
        placeWord(grid, word, row, col, dRow, dCol);
        placed = true;
      }
      attempts++;
    }
  });

  // Fill empty spaces with random letters
  for (let i = 0; i < GRID_SIZE.rows; i++) {
    for (let j = 0; j < GRID_SIZE.cols; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
}

function canPlaceWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  dRow: number,
  dCol: number
): boolean {
  if (startRow < 0 || startCol < 0) return false;
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;
    
    if (row < 0 || row >= GRID_SIZE.rows || col < 0 || col >= GRID_SIZE.cols) {
      return false;
    }
    
    if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
      return false;
    }
  }
  
  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  dRow: number,
  dCol: number
): void {
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;
    grid[row][col] = word[i];
  }
}

export function findWordInGrid(grid: string[][], word: string): { word: string; positions: Position[] } | null {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      for (const [dRow, dCol] of DIRECTIONS) {
        const positions: Position[] = [];
        let found = true;
        
        for (let i = 0; i < word.length; i++) {
          const newRow = row + i * dRow;
          const newCol = col + i * dCol;
          
          if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols || 
              grid[newRow][newCol] !== word[i]) {
            found = false;
            break;
          }
          
          positions.push({ row: newRow, col: newCol });
        }
        
        if (found) {
          return { word, positions };
        }
      }
    }
  }
  
  return null;
}

export function getWordFromPositions(grid: string[][], positions: Position[]): string {
  return positions.map(pos => grid[pos.row][pos.col]).join('');
}

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < GRID_SIZE.rows && 
         pos.col >= 0 && pos.col < GRID_SIZE.cols;
}

export function arePositionsAdjacent(pos1: Position, pos2: Position): boolean {
  return DIRECTIONS.some(([dx, dy]) => 
    pos1.row + dx === pos2.row && pos1.col + dy === pos2.col
  );
}

export function isSpangram(word: Word): boolean {
  const touchesLeft = word.start.col === 0 || word.end.col === 0;
  const touchesRight = word.start.col === GRID_SIZE.cols - 1 || word.end.col === GRID_SIZE.cols - 1;
  const touchesTop = word.start.row === 0 || word.end.row === 0;
  const touchesBottom = word.start.row === GRID_SIZE.rows - 1 || word.end.row === GRID_SIZE.rows - 1;
  
  return (touchesLeft && touchesRight) || (touchesTop && touchesBottom);
}