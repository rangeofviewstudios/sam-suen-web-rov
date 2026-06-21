"use client";

import { useEffect, useRef } from "react";

interface RibbonsProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
}

interface RibbonNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Ribbon {
  nodes: RibbonNode[];
  color: string;
  offset: number;
}

function parseColor(hex: string): [number, number, number, number] {
  // Handle rgba(...)
  const rgba = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgba) return [+rgba[1], +rgba[2], +rgba[3], rgba[4] !== undefined ? +rgba[4] : 1];
  // Handle hex
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
    1,
  ];
}

export default function Ribbons({
  colors = ["#3d7a1a", "#c9a84c"],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 40,
  speedMultiplier = 0.5,
  enableFade = true,
  enableShaderEffect = true,
  effectAmplitude = 2,
}: RibbonsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement!;

    const resize = () => {
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Initialise ribbons at centre
    const cx = () => canvas.width  / 2;
    const cy = () => canvas.height / 2;

    const ribbons: Ribbon[] = colors.map((color, i) => {
      const off = (i - (colors.length - 1) / 2) * offsetFactor * 900;
      return {
        color,
        offset: off,
        nodes: Array.from({ length: pointCount }, () => ({
          x: cx(), y: cy(), vx: 0, vy: 0,
        })),
      };
    });

    // Trail history for each ribbon
    const trails: Array<Array<{ x: number; y: number }>> = ribbons.map(() => []);

    const mouse = { x: cx(), y: cy() };
    let time = 0;
    let raf = 0;

    // Listen on document so ribbons track cursor anywhere on the page,
    // but map to canvas-local coordinates
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    document.addEventListener("mousemove", onMove);

    const tick = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let ri = 0; ri < ribbons.length; ri++) {
        const ribbon  = ribbons[ri];
        const trail   = trails[ri];
        const [r, g, b, baseA] = parseColor(ribbon.color);

        // ── Spring physics ──
        const head = ribbon.nodes[0];
        const tx = mouse.x + ribbon.offset;
        const ty = mouse.y + ribbon.offset * 0.35;
        head.vx += (tx - head.x) * baseSpring;
        head.vy += (ty - head.y) * baseSpring;
        head.vx *= baseFriction;
        head.vy *= baseFriction;
        head.x  += head.vx * speedMultiplier;
        head.y  += head.vy * speedMultiplier;

        for (let ni = 1; ni < ribbon.nodes.length; ni++) {
          const n    = ribbon.nodes[ni];
          const prev = ribbon.nodes[ni - 1];
          n.vx += (prev.x - n.x) * baseSpring;
          n.vy += (prev.y - n.y) * baseSpring;
          n.vx *= baseFriction;
          n.vy *= baseFriction;
          n.x  += n.vx * speedMultiplier;
          n.y  += n.vy * speedMultiplier;
        }

        // ── Trail ──
        trail.unshift({ x: head.x, y: head.y });
        if (trail.length > maxAge) trail.pop();
        if (trail.length < 2) continue;

        // ── Draw segments ──
        ctx.save();
        ctx.lineCap  = "round";
        ctx.lineJoin = "round";

        const len = trail.length;
        for (let si = 0; si < len - 1; si++) {
          const t  = 1 - si / (len - 1);   // 1 = newest → 0 = oldest
          const alpha     = (enableFade ? t * 0.85 : 0.85) * baseA;
          const thickness = baseThickness * t;
          if (thickness < 0.3 || alpha < 0.01) continue;

          let { x: x0, y: y0 } = trail[si];
          let { x: x1, y: y1 } = trail[si + 1];

          if (enableShaderEffect && thickness > 1) {
            const dx  = x1 - x0;
            const dy  = y1 - y0;
            const mag = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx  = -dy / mag;
            const ny  =  dx / mag;
            const wave = Math.sin(si * 0.18 + time * 0.035) * effectAmplitude * t;
            x0 += nx * wave;
            y0 += ny * wave;
            x1 += nx * wave;
            y1 += ny * wave;
          }

          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth   = thickness;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, [
    colors, baseSpring, baseFriction, baseThickness, offsetFactor,
    maxAge, pointCount, speedMultiplier, enableFade, enableShaderEffect, effectAmplitude,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
