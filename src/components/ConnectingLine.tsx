import React, { useEffect, useRef } from 'react';
import { Position } from '../types/game';

interface ConnectingLineProps {
  positions: Position[];
  cellSize: number;
}

export const ConnectingLine: React.FC<ConnectingLineProps> = ({ positions, cellSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || positions.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Start the path
    ctx.beginPath();
    const firstPos = positions[0];
    const startX = firstPos.col * cellSize + cellSize / 2;
    const startY = firstPos.row * cellSize + cellSize / 2;
    ctx.moveTo(startX, startY);

    // Draw curved lines between points
    for (let i = 1; i < positions.length; i++) {
      const prevPos = positions[i - 1];
      const currentPos = positions[i];
      
      const fromX = prevPos.col * cellSize + cellSize / 2;
      const fromY = prevPos.row * cellSize + cellSize / 2;
      const toX = currentPos.col * cellSize + cellSize / 2;
      const toY = currentPos.row * cellSize + cellSize / 2;

      // Calculate control points for quadratic curve
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      const cpX = midX + (Math.random() - 0.5) * 20; // Add slight randomness
      const cpY = midY + (Math.random() - 0.5) * 20;

      ctx.quadraticCurveTo(cpX, cpY, toX, toY);
    }
    
    ctx.stroke();

    // Draw dots at each position
    positions.forEach((pos) => {
      const x = pos.col * cellSize + cellSize / 2;
      const y = pos.row * cellSize + cellSize / 2;
      
      ctx.beginPath();
      ctx.fillStyle = '#4F46E5';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [positions, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      width={cellSize * 8}
      height={cellSize * 8}
    />
  );
};