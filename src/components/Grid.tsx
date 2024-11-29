import React from 'react';
import { Position } from '../types/game';
import { ConnectingLine } from './ConnectingLine';
import { GRID_ROWS, GRID_COLS } from '../utils/gridUtils';

interface GridProps {
  grid: string[][];
  selectedPositions: Position[];
  onCellClick: (position: Position) => void;
  highlightedCells: Set<string>;
  spangramCells: Set<string>;
}

const CELL_SIZE = 40; // w-10 = 40px
const CELL_GAP = 4; // gap-1 = 4px

export function Grid({
  grid,
  selectedPositions,
  onCellClick,
  highlightedCells,
  spangramCells
}: GridProps) {
  const getCellClassName = (row: number, col: number) => {
    const posKey = `${row},${col}`;
    const isSelected = selectedPositions.some(pos => pos.row === row && pos.col === col);
    const isHighlighted = highlightedCells.has(posKey);
    const isSpangram = spangramCells.has(posKey);
    
    return `
      w-10 h-10 flex items-center justify-center text-lg font-bold rounded-lg
      relative
      ${isSelected ? 'bg-blue-200' : 'bg-white'}
      ${isHighlighted ? 'bg-blue-400 text-white' : ''}
      ${isSpangram ? 'bg-yellow-300' : ''}
      transition-colors duration-200
      hover:bg-blue-100 cursor-pointer
      border-2 ${isSelected ? 'border-blue-400' : 'border-gray-200'}
    `;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-lg relative overflow-x-auto">
      <div 
        className="grid gap-1"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(40px, 1fr))`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 40px)`,
          width: 'fit-content',
          margin: '0 auto'
        }}
        role="grid"
        aria-label="Word Search Grid"
      >
        <ConnectingLine
          positions={selectedPositions}
          cellSize={CELL_SIZE}
          gap={CELL_GAP}
        />
        
        {Array.from({ length: GRID_ROWS }).map((_, row) => (
          Array.from({ length: GRID_COLS }).map((_, col) => (
            <button
              key={`${row}-${col}`}
              className={getCellClassName(row, col)}
              onClick={() => onCellClick({ row, col })}
              aria-label={`Cell ${row},${col}`}
            >
              {grid[row][col]}
              {selectedPositions.some(
                (pos, idx) => pos.row === row && pos.col === col
              ) && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                  {selectedPositions.findIndex(
                    pos => pos.row === row && pos.col === col
                  ) + 1}
                </span>
              )}
            </button>
          ))
        ))}
      </div>
      {selectedPositions.length >= 3 && (
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => {
            const event = new CustomEvent('submitWord', { detail: selectedPositions });
            window.dispatchEvent(event);
          }}
        >
          Submit Word
        </button>
      )}
    </div>
  );
}