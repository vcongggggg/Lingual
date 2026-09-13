'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  spotlightColor?: string;
  spotlightRadius?: number;
  showSpotlight?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1000,
  spotlightColor = 'rgba(34, 211, 238, 0.15)',
  spotlightRadius = 350,
  showSpotlight = true,
  onClick,
  style = {},
}: TiltCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxTilt;
    const rY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);
    if (showSpotlight) {
      setSpotlight({ x, y, opacity: 1 });
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    if (showSpotlight) {
      setSpotlight((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div style={{ perspective }} className="relative overflow-visible">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{ transformStyle: 'preserve-3d', ...style }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className={`relative overflow-visible transition-all duration-200 ${className}`}
      >
        {/* Spotlight Glow Tracker */}
        {showSpotlight && (
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 z-10"
            style={{
              opacity: spotlight.opacity,
              background: `radial-gradient(${spotlightRadius}px circle at ${spotlight.x}px ${spotlight.y}px, ${spotlightColor}, transparent 80%)`,
            }}
          />
        )}

        {children}
      </motion.div>
    </div>
  );
}
