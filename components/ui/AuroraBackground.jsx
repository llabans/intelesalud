'use client';

import { motion } from 'motion/react';

/**
 * Animated aurora/mesh gradient background.
 * Uses GPU-composited transforms + filter blur for 60fps performance.
 * Renders behind content via absolute positioning.
 */
export default function AuroraBackground({ className = '' }) {
  const blobs = [
    {
      color: 'rgba(13, 107, 128, 0.12)',
      size: 'w-[600px] h-[600px]',
      position: '-top-40 -left-20',
      animate: { x: [0, 80, -40, 0], y: [0, -60, 40, 0] },
      duration: 22,
    },
    {
      color: 'rgba(26, 143, 170, 0.10)',
      size: 'w-[500px] h-[500px]',
      position: 'top-20 right-0',
      animate: { x: [0, -60, 30, 0], y: [0, 50, -30, 0] },
      duration: 26,
    },
    {
      color: 'rgba(224, 122, 95, 0.07)',
      size: 'w-[450px] h-[450px]',
      position: 'top-60 left-1/3',
      animate: { x: [0, 40, -60, 0], y: [0, -40, 60, 0] },
      duration: 30,
    },
    {
      color: 'rgba(34, 168, 199, 0.08)',
      size: 'w-[350px] h-[350px]',
      position: '-bottom-20 right-1/4',
      animate: { x: [0, -50, 70, 0], y: [0, 70, -50, 0] },
      duration: 24,
    },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${blob.size} ${blob.position}`}
          style={{
            background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
            filter: 'blur(80px)',
            willChange: 'transform',
          }}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
