'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 240;
const IMAGE_FOLDER = '/Hero section scroll animation images sequence';

function getFramePath(index: number): string {
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

  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  // Canvas draw function — use cover fit, no blank bars on sides
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const x = (cw - img.naturalWidth * scale) / 2;
    const y = (ch - img.naturalHeight * scale) / 2;
    
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }, []);

  // Canvas resize function
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = (window.innerHeight - 68) * dpr;
    drawFrame(frameIndexRef.current);
  }, [drawFrame]);

  // Scroll progress calculation
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;
    const spacerHeight = viewportHeight;

    // Total scrollable distance minus the spacer at top and canvas height at bottom
    const totalScrollable = containerHeight - viewportHeight;

    // How far the container top has gone above the viewport top
    const scrolledPast = -rect.top;

    // Subtract the spacer so animation only starts after spacer is scrolled past
    const animationScrolled = scrolledPast - spacerHeight;

    // Animation distance is total minus the spacer
    const animationDistance = totalScrollable - spacerHeight;

    const navbarHeight = 68;
    const isOutOfView = rect.bottom <= 0 || rect.top > navbarHeight;
    
    if (canvasRef.current) {
      canvasRef.current.style.visibility = isOutOfView ? 'hidden' : 'visible';
    }

    const progress = Math.min(1, Math.max(0, animationDistance > 0 ? animationScrolled / animationDistance : 0));


    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.floor(progress * (TOTAL_FRAMES - 1))
    );

    if (frameIndex !== frameIndexRef.current) {
      frameIndexRef.current = frameIndex;
      needsDrawRef.current = true;
    }
  }, []);

  // Image preloading
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
        loadedSoFar += 1;
        setLoadedCount(loadedSoFar);
        if (loadedSoFar === TOTAL_FRAMES) {
          setAllLoaded(true);
        }
      };
    }

    imagesRef.current = images;
  }, []);

  // RAF Loop and listeners
  useEffect(() => {
    if (!allLoaded) return;

    resizeCanvas();
    handleScroll();

    const tick = () => {
      if (needsDrawRef.current) {
        drawFrame(frameIndexRef.current);
        needsDrawRef.current = false;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [allLoaded, drawFrame, handleScroll, resizeCanvas]);

  const loadPct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      {/* Loading screen */}
      {!allLoaded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#E0DEDD',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '5px solid rgba(0,0,0,0.1)',
              borderTopColor: '#000',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px',
            }}
          />
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Loading... {loadPct}%
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Main Container */}
      <div
        ref={containerRef}
        style={{
          height: `calc(100vh + ${TOTAL_FRAMES * 16}px)`,
          position: 'relative',
          backgroundColor: '#E0DEDD',
          visibility: allLoaded ? 'visible' : 'hidden',
        }}
      >
        {/* Spacer div — holds the car still before animation starts */}
        <div
          style={{
            height: '100vh',
            width: '100%',
            flexShrink: 0,
          }}
        />

        {/* Fixed Canvas — locked to the screen */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            top: '68px',
            left: '0',
            width: '100vw',
            height: 'calc(100vh - 68px)',
            display: 'block',
            backgroundColor: '#E0DEDD',
            zIndex: 10,
          }}
        />
      </div>

    </>
  );
}
