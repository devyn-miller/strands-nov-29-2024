import React, { useEffect, useRef } from 'react';
import { Position } from '../types/game';

interface ConnectingLineProps {
  positions: Position[];
  cellSize: number;
  gap: number;
}

export function ConnectingLine({ positions, cellSize, gap }: ConnectingLineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || positions.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous lines
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = '#3B82F6'; // blue-500
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Start path
    ctx.beginPath();

    // Calculate cell center offset
    const centerOffset = cellSize / 2;

    positions.forEach((pos, index) => {
      const x = pos.col * (cellSize + gap) + centerOffset;
      const y = pos.row * (cellSize + gap) + centerOffset;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [positions, cellSize, gap]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  );
}