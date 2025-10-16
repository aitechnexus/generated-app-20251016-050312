import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
class Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: { r: number; g: number; b: number };
  bounds: { x: { min: number; max: number }; y: { min: number; max: number } };
  constructor(canvasWidth: number, canvasHeight: number, color: { r: number; g: number; b: number }) {
    this.bounds = {
      x: { min: 0, max: canvasWidth },
      y: { min: 0, max: canvasHeight },
    };
    this.x = Math.random() * this.bounds.x.max;
    this.y = Math.random() * this.bounds.y.max;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.r = Math.random() * Math.min(canvasWidth, canvasHeight) * 0.1 + 20;
    this.color = color;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x - this.r < this.bounds.x.min || this.x + this.r > this.bounds.x.max) {
      this.vx *= -1;
    }
    if (this.y - this.r < this.bounds.y.min || this.y + this.r > this.bounds.y.max) {
      this.vy *= -1;
    }
  }
}
export function AnimatedGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let orbs: Orb[] = [];
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const lightColors = [
        { r: 201, g: 160, b: 220 }, // #C9A0DC (soft purple)
        { r: 230, g: 199, b: 156 }, // #E6C79C (soft gold)
        { r: 165, g: 105, b: 75 },  // #A5694B (soft brown)
        { r: 243, g: 222, b: 187 }, // #F3DEBB (light beige)
      ];
      const darkColors = [
        { r: 72, g: 50, b: 72 },    // #483248 (deep purple)
        { r: 180, g: 136, b: 17 },  // #B48811 (rich gold)
        { r: 93, g: 64, b: 55 },    // #5D4037 (dark brown)
        { r: 48, g: 25, b: 52 },    // #301934 (darker purple)
      ];
      const colors = isDark ? darkColors : lightColors;
      orbs = colors.map(color => new Orb(canvas.width, canvas.height, color));
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach(orb => {
        orb.update();
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, 0.8)`);
        gradient.addColorStop(1, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, 2 * Math.PI);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}