import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  baseColor: string;
  isHub: boolean;
  pulseOffset: number;
  region: 'cortex' | 'cerebellum' | 'brainstem' | 'inner' | 'stream';
  streamIndex?: number;
  streamProgress?: number;
  streamSpeed?: number;
}

interface ConstellationCanvasProps {
  className?: string;
  interactive?: boolean;
  variant?: 'brain' | 'ambient';
  particleCount?: number;
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  className = '',
  interactive = true,
  variant = 'brain',
  particleCount = 750,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 800;
    let height = 500;

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width || 800;
      height = rect.height || 500;

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

    // Mouse interaction with smooth spring inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = mouseX * 0.8;
      targetRotX = -mouseY * 0.5;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Generate accurate Anatomical Sagittal 3D Brain Point Cloud
    const particles: Particle[] = [];

    if (variant === 'brain') {
      // 1. Cerebral Cortex (Main Upper Lateral Hemisphere)
      const cortexCount = 750;
      for (let i = 0; i < cortexCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);

        // Sagittal brain dimensions: X: [-170, 160], Y: [-130, 70], Z: [-80, 80]
        const rx = 155;
        const ry = 110;
        const rz = 75;

        // Cortical fold wave modulation (gyri and sulci)
        const wave = Math.sin(theta * 5) * Math.cos(phi * 4) * 14;

        let x = (rx + wave) * Math.sin(phi) * Math.cos(theta);
        let y = (ry + wave) * Math.sin(phi) * Math.sin(theta) * 0.9 - 25;
        let z = (rz + wave) * Math.cos(phi);

        // Anatomical shaping: Frontal lobe roundness & Occipital taper
        if (x > 0) {
          y += (x / 160) * 10; // Frontal dip
        } else {
          y -= (x / 170) * 12; // Occipital lift
        }

        // Cut off lower region for cerebellum/brainstem
        if (y > 65 && x < 20) {
          y = 65 - Math.random() * 20;
        }

        // Color mapping: Purple/Violet on posterior (left, -X) to Cyan/Neon Blue on anterior (right, +X)
        const t = Math.max(0, Math.min(1, (x + 160) / 320));
        let color = '#8052ff'; // Purple
        if (t > 0.65) color = '#00d2d3'; // Cyan
        else if (t > 0.45) color = '#38bdf8'; // Sky blue
        else if (t > 0.25) color = '#a855f7'; // Violet

        const isHub = Math.random() < 0.08;

        particles.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          size: isHub ? Math.random() * 3.5 + 2.5 : Math.random() * 1.8 + 1.1,
          baseColor: isHub ? (Math.random() > 0.5 ? '#ffffff' : color) : color,
          isHub,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'cortex',
        });
      }

      // 2. Cerebellum (Dense layered ellipse in posterior-inferior region)
      const cerebellumCount = 190;
      for (let i = 0; i < cerebellumCount; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const crx = 65;
        const cry = 38;
        const crz = 45;

        const x = -85 + crx * Math.sin(v) * Math.cos(u) * 0.9;
        const y = 60 + cry * Math.sin(v) * Math.sin(u);
        const z = crz * Math.cos(v);

        const isHub = Math.random() < 0.06;

        particles.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          size: isHub ? 3.0 : Math.random() * 1.5 + 1.0,
          baseColor: '#8052ff',
          isHub,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'cerebellum',
        });
      }

      // 3. Brainstem (Descending vertical column into spinal cord)
      const stemCount = 130;
      for (let i = 0; i < stemCount; i++) {
        const progress = i / stemCount;
        const y = 50 + progress * 110;
        const radius = (1 - progress * 0.6) * 22;
        const angle = Math.random() * Math.PI * 2;
        
        // Slight S-curve spine
        const curveX = -5 + Math.sin(progress * Math.PI) * 12;
        const x = curveX + Math.cos(angle) * radius * Math.random();
        const z = Math.sin(angle) * radius * Math.random() * 0.8;

        const isHub = Math.random() < 0.05;

        particles.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          size: isHub ? 2.8 : Math.random() * 1.4 + 0.9,
          baseColor: progress > 0.5 ? '#8052ff' : '#a855f7',
          isHub,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'brainstem',
        });
      }

      // 4. Ingestion Data Streams (Flowing particle streams entering from left cards into brain)
      const streamCount = 110;
      for (let i = 0; i < streamCount; i++) {
        const streamIndex = i % 3; // 0: Rx (top), 1: Lab (mid), 2: Path (bot)
        const streamProgress = Math.random();
        const streamSpeed = 0.003 + Math.random() * 0.005;

        particles.push({
          x: 0,
          y: 0,
          z: 0,
          baseX: 0,
          baseY: 0,
          baseZ: 0,
          size: Math.random() * 2.2 + 1.2,
          baseColor: streamIndex === 0 ? '#a855f7' : streamIndex === 1 ? '#00d2d3' : '#8052ff',
          isHub: Math.random() < 0.1,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'stream',
          streamIndex,
          streamProgress,
          streamSpeed,
        });
      }

    } else {
      // Ambient field
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: (Math.random() - 0.5) * 800,
          y: (Math.random() - 0.5) * 600,
          z: (Math.random() - 0.5) * 300,
          baseX: 0,
          baseY: 0,
          baseZ: 0,
          size: Math.random() * 2.5 + 1.0,
          baseColor: Math.random() > 0.5 ? '#8052ff' : '#00d2d3',
          isHub: false,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'cortex',
        });
      }
    }

    let time = 0;
    const fov = 480;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.015;

      // Smooth camera interpolation
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      // Subtle base breathing orbit
      const orbitY = currentRotY + Math.sin(time * 0.4) * 0.06;
      const orbitX = currentRotX + Math.cos(time * 0.3) * 0.04;

      const cosY = Math.cos(orbitY);
      const sinY = Math.sin(orbitY);
      const cosX = Math.cos(orbitX);
      const sinX = Math.sin(orbitX);

      const centerX = width / 2;
      const centerY = height / 2 - 10;

      const projectedPoints: {
        px: number;
        py: number;
        pz: number;
        scale: number;
        p: Particle;
        alpha: number;
        color: string;
      }[] = [];

      // Update and project particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let x = p.baseX;
        let y = p.baseY;
        let z = p.baseZ;

        // Dynamic streaming logic for ingestion streams
        if (p.region === 'stream') {
          p.streamProgress = ((p.streamProgress || 0) + (p.streamSpeed || 0.004)) % 1;
          const prog = p.streamProgress;
          
          // Stream start points (Left floating cards)
          let startY = -70; // Rx
          if (p.streamIndex === 1) startY = 10; // Lab
          if (p.streamIndex === 2) startY = 90; // Path

          const startX = -280;
          const endX = -130 + (p.streamIndex === 1 ? 20 : 0);
          const endY = startY * 0.6;

          // Smooth cubic wave curve entering the posterior cerebrum
          const waveY = Math.sin(prog * Math.PI * 3 + time * 2) * 12;
          x = startX + (endX - startX) * prog;
          y = startY + (endY - startY) * prog + waveY;
          z = (Math.sin(prog * Math.PI * 4) * 25) + (Math.random() - 0.5) * 8;
        } else {
          // Subtle organic neural pulsation
          const pulse = 1 + Math.sin(time * 2 + p.pulseOffset) * 0.02;
          x *= pulse;
          y *= pulse;
          z *= pulse;
        }

        // 3D rotation Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // 3D rotation X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX + 500; // Camera distance

        if (z2 <= 10) continue;

        const scale = fov / z2;
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        // Depth alpha and brightness
        const depthFactor = Math.max(0.2, Math.min(1.0, (z2 - 250) / 450));
        const alpha = Math.max(0.18, Math.min(1.0, 1.25 - depthFactor));

        projectedPoints.push({
          px,
          py,
          pz: z2,
          scale,
          p,
          alpha,
          color: p.baseColor,
        });
      }

      // Sort by depth
      projectedPoints.sort((a, b) => b.pz - a.pz);

      // Draw neural connections (Inter-node synapses)
      if (variant === 'brain') {
        ctx.lineWidth = 0.65;
        const maxDist = 32 * Math.min(1.2, Math.max(0.7, width / 700));

        for (let i = 0; i < projectedPoints.length; i += 2) {
          const p1 = projectedPoints[i];
          if (p1.p.region === 'stream') continue;

          for (let j = i + 1; j < projectedPoints.length; j += 3) {
            const p2 = projectedPoints[j];
            if (p2.p.region === 'stream') continue;

            const dx = p1.px - p2.px;
            const dy = p1.py - p2.py;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const lineAlpha = (1 - dist / maxDist) * 0.28 * Math.min(p1.alpha, p2.alpha);
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              
              // Gradient line between connected nodes
              const grad = ctx.createLinearGradient(p1.px, p1.py, p2.px, p2.py);
              grad.addColorStop(0, p1.color);
              grad.addColorStop(1, p2.color);

              ctx.strokeStyle = grad;
              ctx.globalAlpha = lineAlpha;
              ctx.stroke();
            }
          }
        }
      }

      // Draw nodes (Triangles and glowing synapse hubs)
      for (let i = 0; i < projectedPoints.length; i++) {
        const { px, py, scale, p, alpha, color } = projectedPoints[i];
        const size = Math.max(1.0, p.size * scale);

        ctx.save();
        ctx.translate(px, py);

        if (p.isHub) {
          // Glowing Synapse Star / Node
          ctx.beginPath();
          ctx.arc(0, 0, size * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha * 0.85;
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = alpha;
          ctx.fill();
        } else {
          // Outlined Triangular Glyph Node
          ctx.beginPath();
          const h = size * 1.4;
          ctx.moveTo(0, -h / 2);
          ctx.lineTo(size, h / 2);
          ctx.lineTo(-size, h / 2);
          ctx.closePath();

          ctx.strokeStyle = color;
          ctx.lineWidth = 1.0;
          ctx.globalAlpha = alpha;
          ctx.stroke();

          if (p.region === 'cortex' && Math.random() < 0.15) {
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha * 0.4;
            ctx.fill();
          }
        }

        ctx.restore();
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
  }, [interactive, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none select-none ${className}`}
    />
  );
};

export default ConstellationCanvas;
