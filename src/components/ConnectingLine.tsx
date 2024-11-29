import React from 'react';
import { Position } from '../types/game';

interface ConnectingLineProps {
  positions: Position[];
  cellSize: number;
  gap: number;
}

export function ConnectingLine({ positions, cellSize, gap }: ConnectingLineProps) {
  if (positions.length < 2) return null;

  const svgWidth = 8 * (cellSize + gap) - gap;
  const svgHeight = 6 * (cellSize + gap) - gap;

  const getAdjustedPosition = (pos: Position) => ({
    x: pos.col * (cellSize + gap) + cellSize / 2,
    y: pos.row * (cellSize + gap) + cellSize / 2,
  });

  const points = positions.map(getAdjustedPosition)
    .map(pos => `${pos.x},${pos.y}`)
    .join(' ');

  return (
    <svg
      className="absolute top-4 left-4 pointer-events-none"
      width={svgWidth}
      height={svgHeight}
      style={{ zIndex: 10 }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0"
        className="transition-all duration-200"
      />
    </svg>
  );
}