'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 240;
const IMAGE_FOLDER = '/Hero section scroll animation images sequence';

function getFramePath(index: number): string {
  // Files are named: ezgif-frame-001.png to ezgif-frame-240.png
  const n = String(index + 1).padStart(3, '0');
  return `${IMAGE_FOLDER}/ezgif-frame-${n}.png`;
}



export default function CarWashScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const needsDrawRef = useRef<boolean>(false);
  const scrollProgressRef = useRef<number>(0);
  // scrollProgressRef kept for future use; not consumed by overlays

  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  // ── Draw function ───────────────────────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;   // physical pixels (already scaled by dpr at resize time)
    const ch = canvas.height;

    // Object-fit: cover — fill the full canvas, centred, no blank bars
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const x = (cw - img.naturalWidth * scale) / 2;
    const y = (ch - img.naturalHeight * scale) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }, []);

  // ── Resize handler ──────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = (window.innerHeight - 68) * dpr;
    // Re-draw current frame after resize
    drawFrame(frameIndexRef.current);
  }, [drawFrame]);

  // ── RAF loop ────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (needsDrawRef.current) {
      drawFrame(frameIndexRef.current);
      needsDrawRef.current = false;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame]);

  // ── Preload all images ──────────────────────────────────────────────────────
  useEffect(() => {
    let loadedSoFar = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      images[i] = img;

      img.onload = () => {
        loadedSoFar += 1;
        setLoadedCount(loadedSoFar);
        if (loadedSoFar === TOTAL_FRAMES) {
          setAllLoaded(true);
        }
      };
      img.onerror = () => {
        // Count errored images too so we don't hang forever
        loadedSoFar += 1;
        setLoadedCount(loadedSoFar);
        if (loadedSoFar === TOTAL_FRAMES) {
          setAllLoaded(true);
        }
      };
    }

    imagesRef.current = images;
  }, []);

  // ── Start RAF loop + resize listener once all images are loaded ─────────────
  useEffect(() => {
    if (!allLoaded) return;

    resizeCanvas();
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [allLoaded, resizeCanvas, tick]);

  // ── Scroll handler ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!allLoaded) return;

    needsDrawRef.current = true;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get the bounding rect fresh on every scroll
      const rect = container.getBoundingClientRect();

      // The canvas is sticky at top:68px (navbar height)
      // Frame 0 should show when the TOP of the container hits top:68px
      // That means rect.top === 68 → progress = 0
      // Frame 239 should show when the BOTTOM of the container hits the bottom of the viewport
      // That means rect.bottom === window.innerHeight → progress = 1

      const navbarHeight = 68;
      const visibleCanvasHeight = window.innerHeight - navbarHeight;
      const totalDistance = container.offsetHeight - visibleCanvasHeight;

      // Start pinning when the top of the container reaches the navbar (68px from top)
      const scrolled = navbarHeight - rect.top;
      const progress = Math.min(1, Math.max(0, totalDistance > 0 ? scrolled / totalDistance : 0));

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * (TOTAL_FRAMES - 1))
      );

      if (frameIndex !== frameIndexRef.current) {
        frameIndexRef.current = frameIndex;
        needsDrawRef.current = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allLoaded]);

  // scrollProgress polling removed — no overlays to drive

  const loadPct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      {/* ── Loading screen ────────────────────────────────────────────────── */}
      {!allLoaded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#E8E8E8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: 52,
              height: 52,
              border: '4px solid rgba(0,0,0,0.1)',
              borderTopColor: 'rgba(0,0,0,0.7)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              marginBottom: 20,
            }}
          />
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 600,
              color: 'rgba(0,0,0,0.75)',
              margin: 0,
            }}
          >
            Loading... {loadPct}%
          </p>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(0,0,0,0.4)',
              marginTop: 6,
            }}
          >
            Preparing your cinematic experience
          </p>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {/* ── Scroll container ──────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          height: `${TOTAL_FRAMES * 20}px`,
          position: 'relative',
          backgroundColor: '#E0DEDD',
          visibility: allLoaded ? 'visible' : 'hidden',
        }}
      >
        {/* Sticky canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'sticky',
            top: '68px',
            width: '100vw',
            height: 'calc(100vh - 68px)',
            display: 'block',
            backgroundColor: '#E0DEDD',
          }}
        />

        {/* No overlays — pure canvas animation */}
      </div>
    </>
  );
}
