import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  cluster: number;
}

const PALETTE = [
  '#8052ff', // Electric Iris
  '#ffb829', // Saffron Spark
  '#15846e', // Deep Verdant
  '#a855f7', // Vivid Purple
  '#00d2d3', // Cyan
  '#ff6b81', // Coral Spark
  '#ffffff', // Bone White
];

interface ConstellationCanvasProps {
  className?: string;
  interactive?: boolean;
  particleCount?: number;
  variant?: 'brain' | 'ambient' | 'cluster';
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  className = '',
  interactive = true,
  particleCount = 650,
  variant = 'brain',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 600;
    let height = 600;

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width || 600;
      height = rect.height || 600;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Mouse rotation
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 1.6;
      targetRotX = -y * 1.4;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Generate 3D Brain/Organic Neural cloud coordinates
    const particles: Particle[] = [];
    const count = variant === 'ambient' ? 90 : particleCount;

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;

      if (variant === 'brain') {
        // Dual hemisphere brain structure
        const hemisphere = Math.random() > 0.5 ? 1 : -1;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        
        // Ellipsoidal brain lobes
        const r = 145 + (Math.random() - 0.5) * 40;
        const xOffset = hemisphere * 48;
        const lobeYScale = 0.82;
        const lobeZScale = 1.12;
        
        // Gyri/sulci organic wave
        const wave = Math.sin(theta * 5) * Math.cos(phi * 4) * 20;

        x = (r + wave) * Math.sin(phi) * Math.cos(theta) * 0.75 + xOffset;
        y = (r + wave) * Math.sin(phi) * Math.sin(theta) * lobeYScale;
        z = (r + wave) * Math.cos(phi) * lobeZScale;

        // Indent longitudinal fissure
        if (Math.abs(x) < 22) {
          x *= 0.45;
          z *= 0.9;
        }
      } else if (variant === 'cluster') {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const R = 120;
        const r = 50 + (Math.random() - 0.5) * 25;
        x = (R + r * Math.cos(v)) * Math.cos(u);
        y = (R + r * Math.cos(v)) * Math.sin(u) * 0.6;
        z = r * Math.sin(v);
      } else {
        // Ambient dust
        x = (Math.random() - 0.5) * (width || 1200);
        y = (Math.random() - 0.5) * (height || 800);
        z = (Math.random() - 0.5) * 400;
      }

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 3.2 + 1.8,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() - 0.5) * 0.015,
        cluster: Math.floor(Math.random() * 4),
      });
    }

    // Draw an outlined equilateral triangle glyph
    const drawTriangle = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.beginPath();
      
      const height = size * 1.5;
      c.moveTo(0, -height / 2);
      c.lineTo(size, height / 2);
      c.lineTo(-size, height / 2);
      c.closePath();

      c.strokeStyle = color;
      c.lineWidth = 1.1;
      c.globalAlpha = alpha;
      c.stroke();

      if (color === '#8052ff' || color === '#ffb829') {
        c.fillStyle = color;
        c.globalAlpha = alpha * 0.35;
        c.fill();
      }

      c.restore();
    };

    let baseAngle = 0;
    const fov = 400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;
      baseAngle += 0.004;

      const rotY = baseAngle + currentRotY;
      const rotX = currentRotX * 0.6;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projectedPoints: {
        px: number;
        py: number;
        pz: number;
        scale: number;
        p: Particle;
        alpha: number;
      }[] = [];

      const centerX = width / 2;
      const centerY = height / 2;

      // Project particles to 2D screen space
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.angle += p.speed;
        const pulse = 1 + Math.sin(baseAngle * 2.5 + p.baseZ * 0.02) * 0.035;
        
        let x = p.baseX * pulse;
        let y = p.baseY * pulse;
        let z = p.baseZ * pulse;

        // 3D rotation Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // 3D rotation X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX + 440; // Camera distance

        if (z2 <= 10) continue;

        const scale = fov / z2;
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;
        const depthAlpha = Math.max(0.1, Math.min(1.0, (z2 - 150) / 440));
        const alpha = (1 - depthAlpha * 0.75);

        projectedPoints.push({
          px,
          py,
          pz: z2,
          scale,
          p,
          alpha: Math.min(1, Math.max(0.15, alpha)),
        });
      }

      // Sort by depth
      projectedPoints.sort((a, b) => b.pz - a.pz);

      // Draw neural connections
      ctx.lineWidth = 0.55;
      const maxDist = 36 * Math.min(1.2, Math.max(0.7, width / 600));

      for (let i = 0; i < projectedPoints.length; i += 2) {
        const p1 = projectedPoints[i];
        for (let j = i + 1; j < projectedPoints.length; j += 3) {
          const p2 = projectedPoints[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = p1.p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.stroke();
          }
        }
      }

      // Draw triangle glyphs
      for (let i = 0; i < projectedPoints.length; i++) {
        const { px, py, scale, p, alpha } = projectedPoints[i];
        const glyphSize = Math.max(1.1, p.size * scale * 0.85);
        drawTriangle(ctx, px, py, glyphSize, p.angle, p.color, alpha);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive, particleCount, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none select-none ${className}`}
    />
  );
};
