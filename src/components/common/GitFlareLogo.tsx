import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
interface GitFlareLogoProps {
  size?: number;
  className?: string;
}
export function GitFlareLogo({ size = 24, className }: GitFlareLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);
    // Cloudflare Cloud Shape
    const drawCloud = () => {
      ctx.beginPath();
      ctx.moveTo(size * 0.25, size * 0.75);
      ctx.bezierCurveTo(size * 0.05, size * 0.75, size * 0.05, size * 0.5, size * 0.3, size * 0.35);
      ctx.bezierCurveTo(size * 0.4, size * 0.15, size * 0.6, size * 0.15, size * 0.7, size * 0.35);
      ctx.bezierCurveTo(size * 0.95, size * 0.45, size * 0.95, size * 0.7, size * 0.75, size * 0.75);
      ctx.closePath();
    };
    // Vibrant Cloudflare Orange Gradient
    const cloudGradient = ctx.createLinearGradient(0, 0, size, size);
    cloudGradient.addColorStop(0, '#FFB74D'); // Lighter, more vibrant orange
    cloudGradient.addColorStop(1, '#F57C00'); // Standard orange
    ctx.fillStyle = cloudGradient;
    ctx.strokeStyle = isDark ? '#A15C00' : '#FBC02D';
    ctx.lineWidth = size * 0.025; // Slightly thicker for definition
    drawCloud();
    ctx.fill();
    ctx.stroke();
    // Git Branch Icon (Refined Mirrored Y Shape)
    const centerX = size * 0.5;
    const topY = size * 0.32;
    const midY = size * 0.5;
    const bottomY = size * 0.72;
    const branchXOffset = size * 0.18;
    ctx.strokeStyle = isDark ? '#FAFAFA' : '#111827'; // Brighter white/darker black
    ctx.lineWidth = size * 0.06; // Increased line weight
    ctx.lineCap = 'round';
    // Main stem
    ctx.beginPath();
    ctx.moveTo(centerX, topY);
    ctx.lineTo(centerX, midY);
    ctx.stroke();
    // Left branch
    ctx.beginPath();
    ctx.moveTo(centerX, midY);
    ctx.lineTo(centerX - branchXOffset, bottomY);
    ctx.stroke();
    // Right branch
    ctx.beginPath();
    ctx.moveTo(centerX, midY);
    ctx.lineTo(centerX + branchXOffset, bottomY);
    ctx.stroke();
    // Circles on branches (more prominent)
    const circleRadius = size * 0.06; // Larger radius
    const circleStroke = isDark ? '#111' : '#fff';
    const drawCircle = (x: number, y: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.strokeStyle = circleStroke;
      ctx.lineWidth = size * 0.025; // Stronger stroke
      ctx.fill();
      ctx.stroke();
    };
    // Top circle (Blue)
    drawCircle(centerX, topY, '#29B6F6'); // Brighter blue
    // Left circle (Red)
    drawCircle(centerX - branchXOffset, bottomY, '#EF5350');
    // Right circle (Yellow)
    drawCircle(centerX + branchXOffset, bottomY, '#FFEE58');
  }, [size, isDark]);
  return <canvas ref={canvasRef} style={{ width: size, height: size }} className={className} />;
}