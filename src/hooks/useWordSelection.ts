import { useState, useCallback, useEffect } from 'react';
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
    setSelectedPositions(prev => {
      // If clicking an already selected position
      const existingIndex = prev.findIndex(
        pos => pos.row === position.row && pos.col === position.col
      );

      if (existingIndex !== -1) {
        // If clicking the last selected position, remove it
        if (existingIndex === prev.length - 1) {
          return prev.slice(0, -1);
        }
        // If clicking any other selected position, remove all positions after it
        return prev.slice(0, existingIndex + 1);
      }

      // Don't add if not adjacent to last position (unless it's the first position)
      if (prev.length > 0 && !arePositionsAdjacent(prev[prev.length - 1], position)) {
        return prev;
      }

      return [...prev, position];
    });
    setIsSelecting(true);
    setLastTapTime(Date.now());
    setLastTapPosition(position);
    return {
      type: 'select' as const,
      positions: selectedPositions
    };
  }, [selectedPositions, isValidNextPosition]);

  const resetSelection = useCallback(() => {
    setSelectedPositions([]);
    setLastTapTime(null);
    setLastTapPosition(null);
    setIsSelecting(false);
  }, []);

  const removeLastPosition = useCallback(() => {
    setSelectedPositions(prev => prev.slice(0, -1));
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedPositions.length >= 3) {
        // Submit word event will be handled by the parent component
        const event = new CustomEvent('submitWord', { detail: selectedPositions });
        window.dispatchEvent(event);
        resetSelection();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        removeLastPosition();
      } else if (e.key === 'Escape') {
        resetSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPositions, resetSelection, removeLastPosition]);

  return {
    selectedPositions,
    handleCellClick,
    resetSelection,
    removeLastPosition,
    isSelecting
  };
}