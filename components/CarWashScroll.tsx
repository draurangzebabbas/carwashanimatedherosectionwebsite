'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 240;
const IMAGE_FOLDER = '/Hero%20section%20scroll%20animation%20images%20sequence';

function getFramePath(index: number): string {
  const n = String(index + 1).padStart(3, '0');
  return `${IMAGE_FOLDER}/ezgif-frame-${n}.webp`;
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
  const [isActive, setIsActive] = useState(false);
  const loadedIndicesRef = useRef<Set<number>>(new Set());

  const MIN_FRAMES_TO_START = 30;

  // PART 7 — CANVAS DRAW — COVER FIT, NO BLANK BARS
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // FIND BEST AVAILABLE FRAME (Current or nearest loaded)
    let bestIndex = index;
    if (!loadedIndicesRef.current.has(index)) {
      // Find nearest loaded frame to avoid blank screen
      const loaded = Array.from(loadedIndicesRef.current);
      if (loaded.length === 0) return;
      bestIndex = loaded.reduce((prev, curr) => 
        Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev
      );
    }

    const img = imagesRef.current[bestIndex];
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
    if (imagesRef.current.length > 0) return;

    let loaded = 0;
    const images: HTMLImageElement[] = [];
    const added = new Set();
    const loadOrder: number[] = [];

    // 1. Critical first chunk (Priority 1)
    for (let i = 0; i < 20; i++) {
      loadOrder.push(i);
      added.add(i);
    }
    // 2. Sparse frames for the rest (Priority 2)
    for (let i = 20; i < TOTAL_FRAMES; i += 10) {
      if (!added.has(i)) { loadOrder.push(i); added.add(i); }
    }
    // 3. Fill in the gaps (Priority 3)
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!added.has(i)) { loadOrder.push(i); added.add(i); }
    }

    // Initialize array with placeholders
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      images[i] = new Image();
    }

    // FALLBACK TIMEOUT: If it takes too long, just show the site
    const timeoutId = setTimeout(() => {
      setAllLoaded(true);
      setCanvasReady(true);
    }, 15000); // 15 seconds max wait

    // BATCHED LOADING to prevent browser request congestion
    const BATCH_SIZE = 10;
    const loadBatch = (batchIndex: number) => {
      const start = batchIndex * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, loadOrder.length);
      
      if (start >= loadOrder.length) return;

      for (let i = start; i < end; i++) {
        const index = loadOrder[i];
        const img = images[index];
        img.src = getFramePath(index);
        
        const onImageLoad = () => {
          loaded++;
          loadedIndicesRef.current.add(index);
          
          // Throttled state update: only update UI every 5 frames or when done
          if (loaded % 5 === 0 || loaded === TOTAL_FRAMES) {
            setLoadedCount(loaded);
          }
          
          if (loaded === MIN_FRAMES_TO_START) {
            clearTimeout(timeoutId);
            setAllLoaded(true);
            needsDrawRef.current = true;
            setTimeout(() => setCanvasReady(true), 100);
          }

          // Trigger next batch once half of current batch is ready
          if (loaded % BATCH_SIZE === Math.floor(BATCH_SIZE / 2)) {
            loadBatch(batchIndex + 1);
          }
        };

        img.onload = onImageLoad;
        img.onerror = onImageLoad;
      }
    };

    // Start first batch
    loadBatch(0);

    imagesRef.current = images;
    return () => clearTimeout(timeoutId);
  }, []);


  // Listeners and Draw loop
  useEffect(() => {
    if (!allLoaded) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create a proxy for GSAP to animate
    const scrollProgress = { frame: 0 };
    
    // GSAP ScrollTrigger replaces the manual handleScroll
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom", // Start when the section is just below the fold
      end: "bottom top",    // End when the section is completely above the fold
      scrub: true,
      onUpdate: (self) => {
        // DELAYED START: Hold frame 0 (dirty look) during the first 15% of the scroll (shutter reveal)
        // This ensures the user sees the dirty car as the shutter opens before the wash starts.
        let frameIndex = 0;
        const revealThreshold = 0.15;
        
        if (self.progress > revealThreshold) {
          // Re-map the remaining 85% of scroll to the full 240 frames
          const adjustedProgress = (self.progress - revealThreshold) / (1 - revealThreshold);
          frameIndex = Math.floor(adjustedProgress * (TOTAL_FRAMES - 1));
        }

        if (frameIndex !== frameIndexRef.current) {
          frameIndexRef.current = frameIndex;
          needsDrawRef.current = true;
        }
      },
      // Automatically hide/show canvas when entering/leaving the section
      onToggle: (self) => {
        setIsActive(self.isActive);
      }
    });

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
      st.kill();
      cancelAnimationFrame(raf);
    };
  }, [allLoaded]);



  const loadPercentage = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
  const isBackgroundLoading = allLoaded && loadedCount < TOTAL_FRAMES;

  return (
    <>
      {/* PART 9 — LOADING SCREEN (Pre-start) */}
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
            borderTopColor: '#C8A96E',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '24px'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontFamily: 'Inter', fontSize: '20px', color: '#1A1A1A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ValeoWash <span style={{ color: '#C8A96E' }}>Experience</span>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '13px', color: 'rgba(0,0,0,0.45)', marginTop: '14px', fontWeight: 500, textAlign: 'center' }}>
            Preparing high-fidelity cinematic sequence...<br/>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>{Math.min(100, Math.floor((loadedCount / MIN_FRAMES_TO_START) * 100))}% Ready</span>
          </div>
        </div>
      )}

      {/* PART 10 — BACKGROUND PROGRESS INDICATOR REMOVED AS REQUESTED */}


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
            // PART 2: Simple Entry
            opacity: (!canvasReady || !isActive) ? 0 : 1,
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
          opacity: !isActive ? 0 : currentFrame < 15 ? 0 : currentFrame < 25 ? (currentFrame - 15) / 10 : currentFrame > 55 ? 1 - (currentFrame - 55) / 10 : 1,
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
          opacity: !isActive ? 0 : currentFrame < 110 ? 0 : currentFrame < 120 ? (currentFrame - 110) / 10 : currentFrame > 180 ? 1 - (currentFrame - 180) / 10 : 1,
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
          opacity: !isActive ? 0 : currentFrame < 225 ? 0 : currentFrame < 235 ? (currentFrame - 225) / 10 : 1,
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
