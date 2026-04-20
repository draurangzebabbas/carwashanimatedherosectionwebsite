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
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
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
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // PART 4.1: ANIMATION TIMING
    const startOffset = vh; 
    const relativeScroll = Math.max(scrollY - startOffset, 0);
    
    // Smooth linear mapping over a long range (5.5 VH)
    const animationScrollRange = vh * 5.5;
    const progress = Math.min(relativeScroll / animationScrollRange, 1);
    
    let frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
    frameIndex = Math.min(Math.max(frameIndex, 0), TOTAL_FRAMES - 1);

    if (frameIndex !== frameIndexRef.current) {
      frameIndexRef.current = frameIndex;
      needsDrawRef.current = true;
    }
  };






  // Preload images
  useEffect(() => {
    // Prevent multiple preload cycles during hot reloads
    if (imagesRef.current.length > 0) return;

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
          needsDrawRef.current = true;
          setTimeout(() => setCanvasReady(true), 100);
        }
      };

      img.onload = onImageLoad;
      img.onerror = onImageLoad;
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
      // Update React state for overlays in sync with animation loop
      if (currentFrame !== frameIndexRef.current) {
        setCurrentFrame(frameIndexRef.current);
      }

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
          height: '750vh', // Significant height to allow the clean car and booking card to 'hold' before stats section rises
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
            display: 'block',
            backgroundColor: '#E0DEDD',
            zIndex: 10,
            pointerEvents: 'none',
            // PART 2: Simple Entry
            opacity: !canvasReady ? 0 : 1,
            transform: !canvasReady ? 'translateY(60px)' : 'translateY(0px)',
            transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease',
          }}
        />



        {/* PART 6 — TEXT OVERLAYS */}
        
        {/* Overlay 1 — Dirty Car — Frames 15 to 65 */}
        <div style={{
          position: 'fixed',
          bottom: '12%',
          left: '6%',
          zIndex: 15,
          maxWidth: '420px',
          opacity: currentFrame < 15 ? 0 : currentFrame < 25 ? (currentFrame - 15) / 10 : currentFrame > 55 ? 1 - (currentFrame - 55) / 10 : 1,
          transform: `translateY(${currentFrame < 25 ? (25 - currentFrame) * 3 : 0}px)`,
          transition: 'opacity 300ms ease, transform 300ms ease',
          pointerEvents: 'none',
          display: (currentFrame < 15 || currentFrame > 65) ? 'none' : 'block',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{ color: '#FFFFFF', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, fontFamily: 'Inter' }}>
            Your Car <span style={{ color: '#C8A96E' }}>Deserves Better</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginTop: '12px', lineHeight: 1.6, fontFamily: 'Inter', fontWeight: 500 }}>
            Don't let dirt define your drive. Give your vehicle the treatment it truly earns.
          </div>
        </div>



        {/* Overlay 2 — Being Washed — Frames 110 to 190 */}
        <div style={{
          position: 'fixed',
          bottom: '12%',
          right: '6%',
          zIndex: 15,
          maxWidth: '800px',
          textAlign: 'right',
          opacity: currentFrame < 110 ? 0 : currentFrame < 120 ? (currentFrame - 110) / 10 : currentFrame > 180 ? 1 - (currentFrame - 180) / 10 : 1,
          transform: `translateY(${currentFrame < 120 ? (120 - currentFrame) * 3 : 0}px)`,
          transition: 'opacity 300ms ease, transform 300ms ease',
          pointerEvents: 'none',
          display: (currentFrame < 110 || currentFrame > 190) ? 'none' : 'block',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{ color: '#FFFFFF', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, fontFamily: 'Inter' }}>
            Professional <span style={{ color: '#C8A96E' }}>Washing</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginTop: '12px', lineHeight: 1.6, fontFamily: 'Inter', fontWeight: 500, whiteSpace: 'nowrap' }}>
            High pressure wash removes every layer of dirt and grime in minutes.
          </div>
        </div>




        {/* Overlay 3 — Clean Car — Frames 225 to 240 */}
        <div style={{
          position: 'fixed',
          bottom: '12%',
          left: '50%',
          transform: `translateX(-50%) translateY(${currentFrame < 235 ? (235 - currentFrame) * 3 : 0}px)`,
          zIndex: 15,
          textAlign: 'center',
          opacity: currentFrame < 225 ? 0 : currentFrame < 235 ? (currentFrame - 225) / 10 : 1,
          transition: 'opacity 300ms ease, transform 300ms ease',
          pointerEvents: currentFrame >= 225 ? 'auto' : 'none',
          display: currentFrame < 225 ? 'none' : 'block',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          padding: '32px 48px',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 15px 45px rgba(0,0,0,0.2)',
          width: 'max-content'
        }}>
          <div style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, fontFamily: 'Inter', marginBottom: '24px' }}>
            Starting from <span style={{ color: '#C8A96E' }}>Rs 500</span>
          </div>
          <button style={{ 
            background: '#C8A96E', 
            color: '#181818', 
            border: 'none', 
            padding: '16px 48px', 
            borderRadius: '100px', 
            fontFamily: 'Inter', 
            fontWeight: 800, 
            fontSize: '16px', 
            cursor: 'pointer', 
            boxShadow: '0 10px 25px rgba(200,169,110,0.4)',
            transition: 'all 300ms ease'
          }}>
            Book Now
          </button>
        </div>



      </div>
    </>
  );
}
