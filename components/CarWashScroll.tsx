'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 240;
const IMAGE_FOLDER = '/Hero%20section%20scroll%20animation%20images%20sequence';

function getFramePath(index: number): string {
  const n = String(index + 1).padStart(3, '0');
  return `${IMAGE_FOLDER}/ezgif-frame-${n}.png`;
}

export default function CarWashScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef<number>(0);
  const animationCompleteRef = useRef<boolean>(false);
  const needsDrawRef = useRef<boolean>(false);

  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [displayNone, setDisplayNone] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // PART 7 — CANVAS DRAW — COVER FIT, NO BLANK BARS
  const drawFrame = (index: number) => {
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
  };

  // PART 8 — RESIZE HANDLER
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = (window.innerHeight - 68) * dpr;
    drawFrame(frameIndexRef.current);
  };

  // PART 4 — SCROLL PROGRESS CALCULATION
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;
    const navbarHeight = 68;

    const scrolled = -rect.top;
    const totalScrollable = containerHeight - (viewportHeight - navbarHeight);
    const progress = Math.min(1, Math.max(0, totalScrollable > 0 ? scrolled / totalScrollable : 0));

    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));

    if (frameIndex !== frameIndexRef.current) {
      frameIndexRef.current = frameIndex;
      needsDrawRef.current = true;
    }

    if (frameIndex >= TOTAL_FRAMES - 1) {
      if (!animationCompleteRef.current) {
        animationCompleteRef.current = true;
        setAnimationComplete(true);
        // PART 3: After transition completes, set display: none
        setTimeout(() => {
          if (animationCompleteRef.current) setDisplayNone(true);
        }, 900);
      }
    } else {
      if (animationCompleteRef.current) {
        animationCompleteRef.current = false;
        setAnimationComplete(false);
        setDisplayNone(false);
      }
    }
  };

  // Preload images
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      
      const onImageLoad = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setAllLoaded(true);
          needsDrawRef.current = true; // Ensure we draw the first frame
          // PART 2: canvasReady becomes true 100ms after images load
          setTimeout(() => setCanvasReady(true), 100);
        }
      };

      img.onload = onImageLoad;
      img.onerror = onImageLoad; // Don't get stuck on a broken image
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Listeners and Draw loop
  useEffect(() => {
    if (!allLoaded) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll);

    let raf: number;
    const render = () => {
      if (needsDrawRef.current) {
        drawFrame(frameIndexRef.current);
        needsDrawRef.current = false;
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [allLoaded]);

  // PART 6: Text Overlays polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentFrame !== frameIndexRef.current) {
        setCurrentFrame(frameIndexRef.current);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [currentFrame]);

  const loadPercentage = Math.floor((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      {/* PART 9 — LOADING SCREEN */}
      {!allLoaded && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#E0DEDD',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0,0,0,0.1)',
            borderTopColor: 'rgba(0,0,0,0.7)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontFamily: 'Inter', fontSize: '18px', color: 'rgba(0,0,0,0.7)', fontWeight: 500 }}>
            Loading... {loadPercentage}%
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '14px', color: 'rgba(0,0,0,0.35)', marginTop: '8px' }}>
            Preparing your experience
          </div>
        </div>
      )}

      {/* PART 1 — CANVAS SETUP & CONTAINER */}
      <div
        ref={containerRef}
        style={{
          height: `calc(100vh + ${TOTAL_FRAMES * 16}px)`,
          position: 'relative',
          backgroundColor: '#E0DEDD',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            top: '68px',
            left: '0',
            width: '100vw',
            height: 'calc(100vh - 68px)',
            display: displayNone ? 'none' : 'block',
            backgroundColor: '#E0DEDD',
            zIndex: 10,
            pointerEvents: 'none',
            // PART 2 & 3: Entry and Exit Animation
            opacity: !canvasReady ? 0 : (animationComplete ? 0 : 1),
            transform: !canvasReady 
              ? 'translateY(60px)' 
              : (animationComplete ? 'translateY(-60px)' : 'translateY(0px)'),
            transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease',
          }}
        />

        {/* PART 6 — TEXT OVERLAYS */}
        
        {/* Overlay 1 — Dirty Car — Frames 0 to 55 */}
        <div style={{
          position: 'fixed',
          bottom: '10%',
          left: '6%',
          zIndex: 15,
          maxWidth: '320px',
          opacity: currentFrame < 10 ? currentFrame / 10 : currentFrame > 45 ? 1 - (currentFrame - 45) / 10 : 1,
          transform: `translateY(${currentFrame < 10 ? (10 - currentFrame) * 3 : 0}px)`,
          transition: 'opacity 400ms ease, transform 400ms ease',
          pointerEvents: 'none',
          display: currentFrame > 55 ? 'none' : 'block'
        }}>
          <div style={{ color: '#C8A96E', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Inter', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>Before</div>
          <div style={{ color: '#1A1A1A', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, fontFamily: 'Inter', textShadow: '0 2px 15px rgba(255,255,255,0.5)' }}>Your Car<br/>Deserves Better</div>
          <div style={{ color: '#4A4A4A', fontSize: '14px', marginTop: '10px', lineHeight: 1.6, fontFamily: 'Inter', fontWeight: 500 }}>Don't let dirt define your drive</div>
        </div>

        {/* Overlay 2 — Being Washed — Frames 70 to 165 */}
        <div style={{
          position: 'fixed',
          bottom: '10%',
          right: '6%',
          zIndex: 15,
          maxWidth: '320px',
          textAlign: 'right',
          opacity: currentFrame < 70 ? 0 : currentFrame < 80 ? (currentFrame - 70) / 10 : currentFrame > 155 ? 1 - (currentFrame - 155) / 10 : 1,
          transform: `translateY(${currentFrame < 80 ? (80 - currentFrame) * 3 : 0}px)`,
          transition: 'opacity 400ms ease, transform 400ms ease',
          pointerEvents: 'none',
          display: (currentFrame < 70 || currentFrame > 165) ? 'none' : 'block'
        }}>
          <div style={{ color: '#C8A96E', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Inter', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>The Process</div>
          <div style={{ color: '#1A1A1A', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, fontFamily: 'Inter', textShadow: '0 2px 15px rgba(255,255,255,0.5)' }}>Professional<br/>Care</div>
          <div style={{ color: '#4A4A4A', fontSize: '14px', marginTop: '10px', lineHeight: 1.6, fontFamily: 'Inter', fontWeight: 500 }}>High pressure wash removes every layer of dirt and grime</div>
        </div>

        {/* Overlay 3 — Clean Car — Frames 185 to 239 */}
        <div style={{
          position: 'fixed',
          bottom: '10%',
          left: '50%',
          transform: `translateX(-50%) translateY(${currentFrame < 195 ? (195 - currentFrame) * 3 : 0}px)`,
          zIndex: 15,
          textAlign: 'center',
          opacity: currentFrame < 185 ? 0 : currentFrame < 195 ? (currentFrame - 185) / 10 : 1,
          transition: 'opacity 400ms ease, transform 400ms ease',
          pointerEvents: currentFrame >= 185 ? 'auto' : 'none',
          display: currentFrame < 185 ? 'none' : 'block'
        }}>
          <div style={{ color: '#C8A96E', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Inter', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>The Result</div>
          <div style={{ color: '#1A1A1A', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, fontFamily: 'Inter', textShadow: '0 2px 15px rgba(255,255,255,0.5)' }}>Ready to Book?</div>
          <div style={{ color: '#4A4A4A', fontSize: '14px', marginTop: '10px', marginBottom: '20px', fontFamily: 'Inter', fontWeight: 500 }}>Starting from Rs 500</div>
          <button style={{ background: '#1A1A1A', color: '#FFFFFF', border: 'none', padding: '12px 32px', borderRadius: '100px', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}>Book Now</button>
        </div>
      </div>
    </>
  );
}
