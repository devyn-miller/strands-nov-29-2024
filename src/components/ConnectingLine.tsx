import React, { useEffect, useRef } from 'react';
import { Position } from '../types/game';

interface ConnectingLineProps {
  positions: Position[];
  cellSize: number;
  padding: number;
}

export const ConnectingLine: React.FC<ConnectingLineProps> = ({ positions, cellSize, padding = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || positions.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Calculate cell center positions
    const points = positions.map(pos => ({
      x: pos.col * cellSize + cellSize / 2 + padding,
      y: pos.row * cellSize + cellSize / 2 + padding
    }));

    // Draw connecting line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i - 1].x + points[i].x) / 2;
      const yc = (points[i - 1].y + points[i].y) / 2;
      
      // Use quadratic curves for smoother lines
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    
    // Connect to the last point
    if (points.length > 1) {
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
    }
    
    ctx.stroke();

    // Draw dots at each point
    ctx.fillStyle = '#3b82f6';
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [positions, cellSize, padding]);

  // Calculate canvas dimensions based on grid size
  const canvasWidth = cellSize * 9 + padding * 2; 
  const canvasHeight = cellSize * 9 + padding * 2; 

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`
      }}
    />
  );
};