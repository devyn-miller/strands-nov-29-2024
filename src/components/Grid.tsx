import React from 'react';
import { Position } from '../types/game';
import { ConnectingLine } from './ConnectingLine';

interface GridProps {
  grid: string[][];
  selectedPositions: Position[];
  onCellClick: (position: Position) => void;
  highlightedCells: Set<string>;
  spangramCells: Set<string>;
}

const CELL_SIZE = 48; // w-12 = 48px
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
      w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg
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
    <div 
      className="grid grid-cols-8 gap-1 p-4 bg-gray-100 rounded-xl shadow-lg relative"
      role="grid"
      aria-label="Word Search Grid"
    >
      <ConnectingLine
        positions={selectedPositions}
        cellSize={CELL_SIZE}
        gap={CELL_GAP}
      />
      
      {grid.map((row, rowIndex) => (
        row.map((letter, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className={getCellClassName(rowIndex, colIndex)}
            onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
            aria-label={`Grid cell ${letter} at row ${rowIndex + 1}, column ${colIndex + 1}`}
          >
            {letter}
            {selectedPositions.some(
              (pos, idx) => pos.row === rowIndex && pos.col === colIndex
            ) && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                {selectedPositions.findIndex(
                  pos => pos.row === rowIndex && pos.col === colIndex
                ) + 1}
              </span>
            )}
          </button>
        ))
      ))}
    </div>
  );
}