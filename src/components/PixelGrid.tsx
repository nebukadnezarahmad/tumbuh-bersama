import { useEffect, useRef } from "react";

interface PixelGridProps {
  cellSize?: number;
  gap?: number;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

// Adapted from SIGAP's PixelGrid, with a quieter palette for family planning.
export function PixelGrid({
  cellSize = 42,
  gap = 3,
  speed = 0.3,
  interactive = true,
  className = "",
}: PixelGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let context: CanvasRenderingContext2D | null;
    try {
      context = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!context) return;
    const ctx = context;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionForcedOff =
      new URLSearchParams(window.location.search).get("motion") === "off";
    let reducedMotion = motionQuery.matches || motionForcedOff;
    let isVisible = true;
    let frame: number | null = null;
    let width = 0;
    let height = 0;
    let elapsed = 0;
    let lastTime = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerInside = false;
    let pointerIntensity = 0;
    let pointerListenersAttached = false;

    const clearPointer = () => {
      pointerInside = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        clearPointer();
        return;
      }
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        clearPointer();
        return;
      }
      if (!pointerInside) {
        pointerX = x;
        pointerY = y;
      }
      targetX = x;
      targetY = y;
      pointerInside = true;
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) clearPointer();
    };

    const updatePointerListeners = () => {
      const shouldAttach = interactive && !reducedMotion;
      if (shouldAttach === pointerListenersAttached) return;
      pointerListenersAttached = shouldAttach;
      if (shouldAttach) {
        window.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        window.addEventListener("pointerout", handlePointerOut, {
          passive: true,
        });
        window.addEventListener("blur", clearPointer);
      } else {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerout", handlePointerOut);
        window.removeEventListener("blur", clearPointer);
        pointerInside = false;
        pointerIntensity = 0;
      }
    };

    const draw = (time: number) => {
      if (width <= 0 || height <= 0) return;
      ctx.clearRect(0, 0, width, height);
      const step = Math.max(1, cellSize + gap);
      const columns = Math.ceil(width / step);
      const rows = Math.ceil(height / step);
      pointerX += (targetX - pointerX) * 0.1;
      pointerY += (targetY - pointerY) * 0.1;
      pointerIntensity += ((pointerInside ? 1 : 0) - pointerIntensity) * 0.08;

      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
          const x = column * step;
          const y = row * step;
          const waveA =
            Math.sin(column * 0.18 + time * 0.7) *
            Math.cos(row * 0.18 - time * 0.5);
          const waveB = Math.sin((column + row) * 0.12 + time * 0.35);
          const wave = Math.max(0, (waveA + waveB) * 0.5);
          const distance = Math.hypot(
            x + cellSize / 2 - pointerX,
            y + cellSize / 2 - pointerY,
          );
          const proximity = Math.max(0, 1 - distance / 220);
          const pointer = reducedMotion
            ? 0
            : proximity * proximity * pointerIntensity;
          const alpha = Math.min(0.18, 0.018 + wave * 0.065 + pointer * 0.075);
          const selector =
            (Math.sin(column * 0.25 - row * 0.2 + time * 0.2) + 1) / 2;
          const color =
            selector > 0.8
              ? "217, 162, 87"
              : selector > 0.6
                ? "145, 177, 197"
                : selector > 0.25
                  ? "121, 168, 139"
                  : "23, 78, 67";
          ctx.fillStyle = `rgba(${color}, ${alpha})`;
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(x, y, cellSize, cellSize, 4);
          } else {
            ctx.rect(x, y, cellSize, cellSize);
          }
          ctx.fill();
        }
      }
    };

    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };

    const loop = (now: number) => {
      frame = null;
      elapsed += Math.min((now - lastTime) / 1000, 0.05) * speed;
      lastTime = now;
      draw(elapsed);
      if (isVisible && !document.hidden && !reducedMotion)
        frame = requestAnimationFrame(loop);
    };

    const updateAnimation = () => {
      if (reducedMotion || !isVisible || document.hidden) {
        stop();
        clearPointer();
        if (reducedMotion) draw(0);
      } else if (frame === null) {
        lastTime = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(reducedMotion ? 0 : elapsed);
    };

    const onMotionChange = () => {
      reducedMotion = motionQuery.matches || motionForcedOff;
      updatePointerListeners();
      updateAnimation();
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    const visibilityObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            isVisible = entry?.isIntersecting ?? true;
            updateAnimation();
          })
        : null;

    resize();
    updatePointerListeners();
    updateAnimation();
    resizeObserver?.observe(container);
    visibilityObserver?.observe(container);
    if (!resizeObserver) window.addEventListener("resize", resize);
    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", updateAnimation);

    return () => {
      stop();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", clearPointer);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", updateAnimation);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
    };
  }, [cellSize, gap, speed, interactive]);

  return (
    <div
      ref={containerRef}
      className={`pixel-grid${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
