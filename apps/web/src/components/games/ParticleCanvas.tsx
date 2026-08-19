'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ParticleCanvasHandle {
  spawnConfetti: (x?: number, y?: number) => void;
  spawnComboSpark: (x: number, y: number, text?: string) => void;
  spawnXPFloat: (x: number, y: number, amount: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'star';
}

interface FloatingText {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  maxAge: number;
  age: number;
}

const ARCADE_COLORS = ['#f59e0b', '#2dd4bf', '#fb7185', '#38bdf8', '#a855f7', '#4ade80', '#ffffff'];

const ParticleCanvas = forwardRef<ParticleCanvasHandle, { className?: string }>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    spawnConfetti: (originX?: number, originY?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const startX = originX ?? canvas.width / 2;
      const startY = originY ?? canvas.height / 3;

      for (let i = 0; i < 75; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 9;
        particlesRef.current.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          color: ARCADE_COLORS[Math.floor(Math.random() * ARCADE_COLORS.length)],
          size: 6 + Math.random() * 6,
          alpha: 1,
          decay: 0.008 + Math.random() * 0.012,
          gravity: 0.25,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          shape: Math.random() > 0.4 ? 'rect' : 'circle',
        });
      }
    },

    spawnComboSpark: (x: number, y: number, text?: string) => {
      for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 * i) / 24;
        const speed = 3 + Math.random() * 5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: ARCADE_COLORS[Math.floor(Math.random() * ARCADE_COLORS.length)],
          size: 4 + Math.random() * 4,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
          gravity: 0.1,
          rotation: 0,
          vRot: 0,
          shape: 'circle',
        });
      }

      if (text) {
        floatingTextsRef.current.push({
          x,
          y: y - 20,
          vy: -2,
          text,
          color: '#fbbf24',
          alpha: 1,
          scale: 1.4,
          maxAge: 45,
          age: 0,
        });
      }
    },

    spawnXPFloat: (x: number, y: number, amount: number) => {
      floatingTextsRef.current.push({
        x,
        y: y - 10,
        vy: -2.5,
        text: `+${amount} XP ⚡`,
        color: '#2dd4bf',
        alpha: 1,
        scale: 1.3,
        maxAge: 40,
        age: 0,
      });
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render & Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        p.rotation += p.vRot;

        if (p.alpha <= 0 || p.y > canvas.height + 20) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Render & Update Floating Texts
      for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
        const ft = floatingTextsRef.current[i];
        ft.y += ft.vy;
        ft.age += 1;
        ft.alpha = 1 - ft.age / ft.maxAge;

        if (ft.age >= ft.maxAge) {
          floatingTextsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = `bold ${Math.round(18 * ft.scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-40 ${props.className || ''}`}
    />
  );
});

ParticleCanvas.displayName = 'ParticleCanvas';
export default ParticleCanvas;
