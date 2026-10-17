import React, { useEffect, useRef, useCallback } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

const COLORS = ['#f4cc77', '#c7b5f5', '#ffffff', '#f6dce8', '#ffd580'];

/**
 * SparkleTrail: Old-school glitter cursor trail with canvas overlay.
 */
export default function SparkleTrail({ chaosMode = false }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const colorIndexRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Draw 4-point twinkle star
  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const addParticle = useCallback(
    (x, y) => {
      const maxParticles = chaosMode ? 65 : 30;
      if (particlesRef.current.length >= maxParticles) {
        // Drop oldest to keep pool capped
        particlesRef.current.shift();
      }

      colorIndexRef.current = (colorIndexRef.current + 1) % COLORS.length;
      const color = COLORS[colorIndexRef.current];

      const baseSize = chaosMode
        ? 4 + Math.random() * 6
        : 2 + Math.random() * 4;

      const vy = chaosMode
        ? -1.2 - Math.random() * 2.5
        : -0.5 - Math.random() * 1.5;

      const vx = chaosMode
        ? (Math.random() - 0.5) * 3.5
        : (Math.random() - 0.5) * 2;

      const isStarShape = Math.random() > 0.35;

      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * (chaosMode ? 14 : 6),
        y: y + (Math.random() - 0.5) * (chaosMode ? 14 : 6),
        size: baseSize,
        initialSize: baseSize,
        opacity: 1,
        fadeSpeed: chaosMode ? 0.025 : 0.03,
        velocityY: vy,
        velocityX: vx,
        color: color,
        isStarShape: isStarShape,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.15
      });
    },
    [chaosMode]
  );

  useEffect(() => {
    // Check for touch device or reduced motion
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0));

    if (prefersReducedMotion || isTouch) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI resize
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Throttled mouse movement
    const handleMouseMove = (e) => {
      const now = performance.now();
      // Throttle to approx 60fps (16ms)
      if (now - lastTimeRef.current >= 16) {
        lastTimeRef.current = now;
        addParticle(e.clientX, e.clientY);
        if (chaosMode) {
          addParticle(e.clientX, e.clientY);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const remainingParticles = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        // Update physics
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.opacity -= p.fadeSpeed;
        p.size *= 0.96;
        p.rotation += p.rotationSpeed;

        if (p.opacity > 0.05 && p.size > 0.5) {
          remainingParticles.push(p);

          // Draw particle
          if (p.isStarShape) {
            drawStar(
              ctx,
              p.x,
              p.y,
              4,
              p.size,
              p.size * 0.45,
              p.color,
              p.opacity
            );
          } else {
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      particlesRef.current = remainingParticles;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [addParticle, chaosMode, prefersReducedMotion]);

  // If reduced motion is requested or running on touch, don't render canvas
  if (
    prefersReducedMotion ||
    (typeof window !== 'undefined' &&
      ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0)))
  ) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
      aria-hidden="true"
    />
  );
}
