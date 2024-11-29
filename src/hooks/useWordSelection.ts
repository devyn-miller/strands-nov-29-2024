import { useState, useCallback } from 'react';
import { Position } from '../types/game';
import { arePositionsAdjacent } from '../utils/gridUtils';

export function useWordSelection() {
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  const [lastTapPosition, setLastTapPosition] = useState<Position | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const isValidNextPosition = useCallback((current: Position, next: Position): boolean => {
    if (selectedPositions.length === 0) return true;
    const lastSelected = selectedPositions[selectedPositions.length - 1];
    return arePositionsAdjacent(lastSelected, next);
  }, [selectedPositions]);

  const handleCellClick = useCallback((position: Position) => {
    const currentTime = Date.now();

    // Handle double-tap submission
    if (
      lastTapTime &&
      lastTapPosition &&
      position.row === lastTapPosition.row &&
      position.col === lastTapPosition.col &&
      currentTime - lastTapTime < 300 &&
      selectedPositions.length > 0
    ) {
      setIsSelecting(false);
      return {
        type: 'submit' as const,
        positions: selectedPositions
      };
    }

    // Handle regular tap
    if (isValidNextPosition(selectedPositions[selectedPositions.length - 1] || position, position)) {
      setSelectedPositions(prev => {
        const existingIndex = prev.findIndex(
          pos => pos.row === position.row && pos.col === position.col
        );
        
        if (existingIndex !== -1) {
          return prev.slice(0, existingIndex);
        }
        
        return [...prev, position];
      });
      setIsSelecting(true);
    }

    setLastTapTime(currentTime);
    setLastTapPosition(position);

    return {
      type: 'select' as const,
      positions: selectedPositions
    };
  }, [selectedPositions, lastTapTime, lastTapPosition, isValidNextPosition]);

  const resetSelection = useCallback(() => {
    setSelectedPositions([]);
    setLastTapTime(null);
    setLastTapPosition(null);
    setIsSelecting(false);
  }, []);

  return {
    selectedPositions,
    handleCellClick,
    resetSelection,
    isSelecting
  };
}