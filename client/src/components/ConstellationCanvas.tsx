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
  region: 'frontal' | 'parietal' | 'occipital' | 'temporal' | 'cerebellum' | 'brainstem' | 'tracts' | 'stream' | 'ambient';
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
  particleCount = 1100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 800;
    let height = 550;

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width || 800;
      height = rect.height || 550;

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

    // Mouse interaction tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 0.7;
      targetRotX = -y * 0.45;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // High-Fidelity Anatomical Sagittal Brain Modeling
    const particles: Particle[] = [];

    if (variant === 'brain') {
      
      // Helper function to color map by X position: Violet on Left (-X) to Cyan on Right (+X)
      const getColor = (x: number, isHub = false) => {
        // normalized X: -180 to +180 -> 0 to 1
        const t = Math.max(0, Math.min(1, (x + 160) / 320));
        if (isHub && Math.random() < 0.3) return '#ffffff';
        if (t > 0.62) return '#00d2d3'; // Cyan
        if (t > 0.42) return '#38bdf8'; // Electric Blue
        if (t > 0.22) return '#a855f7'; // Purple
        return '#8052ff'; // Deep Violet
      };

      // 1. Cerebral Cortex Dome (Frontal, Parietal, Occipital, Temporal)
      const cortexCount = 700;
      for (let i = 0; i < cortexCount; i++) {
        // Parametric hemisphere mapping
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);

        // Base Anatomical Dimensions
        const rx = 160;
        const ry = 105;
        const rz = 70;

        let x = rx * Math.sin(phi) * Math.cos(theta);
        let y = ry * Math.sin(phi) * Math.sin(theta) - 20;
        let z = rz * Math.cos(phi);

        // Gyri and Sulci organic brain ripples
        const wave = Math.sin(theta * 6.5) * Math.cos(phi * 5.2) * 12;
        x += wave * Math.sin(phi) * Math.cos(theta);
        y += wave * Math.sin(phi) * Math.sin(theta);
        z += wave * Math.cos(phi);

        // Anatomical lateral brain shape tuning:
        if (x > 30) {
          // Frontal Lobe: Anterior curvature & downward rounded nose
          y += (x / 160) * 8;
        } else if (x < -40) {
          // Occipital Lobe: Tapered posterior protrusion
          y -= ((x + 40) / 120) * 10;
        }

        // Sylvian Fissure / Temporal Lobe shaping
        if (x > -30 && x < 70 && y > 15) {
          // Temporal lobe bulge
          y += 12;
          z *= 1.1;
        }

        // Cut out bottom-left space for Cerebellum and Brainstem
        if (y > 45 && x < 10) {
          y = 45 - Math.random() * 15;
        }

        const isHub = Math.random() < 0.09;
        const color = getColor(x, isHub);

        particles.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          size: isHub ? Math.random() * 3.4 + 2.2 : Math.random() * 1.8 + 1.0,
          baseColor: color,
          isHub,
          pulseOffset: Math.random() * Math.PI * 2,
          region: x > 30 ? 'frontal' : x < -40 ? 'occipital' : 'parietal',
        });
      }

      // 2. Cerebellum (Dense cauliflower structure below occipital lobe)
      const cerebellumCount = 220;
      for (let i = 0; i < cerebellumCount; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const crx = 65;
        const cry = 36;
        const crz = 45;

        // Positioned at X: -85, Y: +65
        let x = -85 + crx * Math.sin(v) * Math.cos(u) * 0.95;
        let y = 65 + cry * Math.sin(v) * Math.sin(u) * 0.85;
        let z = crz * Math.cos(v);

        // Layered folia ripples
        const folia = Math.sin(y * 0.4) * 4;
        x += folia;

        const isHub = Math.random() < 0.08;

        particles.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          size: isHub ? 3.0 : Math.random() * 1.5 + 0.9,
          baseColor: isHub ? '#ffffff' : '#8052ff',
          isHub,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'cerebellum',
        });
      }

      // 3. Brainstem & Spinal Cord (Curved stalk descending vertically)
      const stemCount = 140;
      for (let i = 0; i < stemCount; i++) {
        const progress = i / stemCount;
        const y = 45 + progress * 125;
        const radius = (1 - progress * 0.55) * 20;
        const angle = Math.random() * Math.PI * 2;

        // Graceful S-curve stalk
        const curveX = -5 + Math.sin(progress * Math.PI * 0.9) * 14;
        const x = curveX + Math.cos(angle) * radius * Math.random();
        const z = Math.sin(angle) * radius * Math.random() * 0.75;

        const isHub = Math.random() < 0.06;

        particles.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          size: isHub ? 2.8 : Math.random() * 1.4 + 0.8,
          baseColor: isHub ? '#ffffff' : progress > 0.4 ? '#8052ff' : '#a855f7',
          isHub,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'brainstem',
        });
      }

      // 4. Internal Radiating White Matter Neural Tracts (Corpus Callosum & Internal Capsule)
      const tractCount = 120;
      for (let i = 0; i < tractCount; i++) {
        const t = Math.random();
        const angle = t * Math.PI;
        // Inner arc bridging brainstem to cortex
        const rx = 100 * t;
        const ry = 60 * t;
        const x = -30 + Math.cos(angle) * rx;
        const y = 20 - Math.sin(angle) * ry;
        const z = (Math.random() - 0.5) * 35;

        particles.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          size: Math.random() * 1.6 + 0.8,
          baseColor: getColor(x),
          isHub: Math.random() < 0.05,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'tracts',
        });
      }

      // 5. Inflow Data Stream Particles (Entering from left cards)
      const streamCount = 90;
      for (let i = 0; i < streamCount; i++) {
        const streamIndex = i % 3;
        particles.push({
          x: 0,
          y: 0,
          z: 0,
          baseX: 0,
          baseY: 0,
          baseZ: 0,
          size: Math.random() * 2.2 + 1.2,
          baseColor: streamIndex === 0 ? '#a855f7' : streamIndex === 1 ? '#00d2d3' : '#8052ff',
          isHub: Math.random() < 0.12,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'stream',
          streamIndex,
          streamProgress: Math.random(),
          streamSpeed: 0.003 + Math.random() * 0.004,
        });
      }

    } else {
      // Ambient field
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: (Math.random() - 0.5) * 900,
          y: (Math.random() - 0.5) * 600,
          z: (Math.random() - 0.5) * 350,
          baseX: 0,
          baseY: 0,
          baseZ: 0,
          size: Math.random() * 2.4 + 1.0,
          baseColor: Math.random() > 0.5 ? '#8052ff' : '#00d2d3',
          isHub: false,
          pulseOffset: Math.random() * Math.PI * 2,
          region: 'ambient',
        });
      }
    }

    let time = 0;
    const fov = 480;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.014;

      // Smooth camera interpolation
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      const orbitY = currentRotY + Math.sin(time * 0.35) * 0.05;
      const orbitX = currentRotX + Math.cos(time * 0.28) * 0.03;

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

      // Project particles to 2D
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let x = p.baseX;
        let y = p.baseY;
        let z = p.baseZ;

        if (p.region === 'stream') {
          p.streamProgress = ((p.streamProgress || 0) + (p.streamSpeed || 0.003)) % 1;
          const prog = p.streamProgress;
          
          let startY = -75; // Rx
          if (p.streamIndex === 1) startY = 10; // Lab
          if (p.streamIndex === 2) startY = 95; // Path

          const startX = -270;
          const endX = -135;
          const endY = startY * 0.55;

          const waveY = Math.sin(prog * Math.PI * 3 + time * 2) * 10;
          x = startX + (endX - startX) * prog;
          y = startY + (endY - startY) * prog + waveY;
          z = (Math.sin(prog * Math.PI * 4) * 20) + (Math.random() - 0.5) * 6;
        } else {
          const pulse = 1 + Math.sin(time * 2 + p.pulseOffset) * 0.018;
          x *= pulse;
          y *= pulse;
          z *= pulse;
        }

        // 3D rotation Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // 3D rotation X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX + 490;

        if (z2 <= 10) continue;

        const scale = fov / z2;
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        const depthFactor = Math.max(0.2, Math.min(1.0, (z2 - 240) / 460));
        const alpha = Math.max(0.18, Math.min(1.0, 1.22 - depthFactor));

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

      // Draw neural connections
      if (variant === 'brain') {
        ctx.lineWidth = 0.65;
        const maxDist = 30 * Math.min(1.2, Math.max(0.7, width / 700));

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

      // Draw glowing nodes and triangle glyphs
      for (let i = 0; i < projectedPoints.length; i++) {
        const { px, py, scale, p, alpha, color } = projectedPoints[i];
        const size = Math.max(1.0, p.size * scale);

        ctx.save();
        ctx.translate(px, py);

        if (p.isHub) {
          ctx.beginPath();
          ctx.arc(0, 0, size * 1.35, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha * 0.85;
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = alpha;
          ctx.fill();
        } else {
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

          if (Math.random() < 0.12) {
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha * 0.35;
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
  }, [interactive, variant, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none select-none ${className}`}
    />
  );
};

export default ConstellationCanvas;
