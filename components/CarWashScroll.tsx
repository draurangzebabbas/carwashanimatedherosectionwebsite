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
  const isActiveRef = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(false);
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

  const shutterAudioRef = useRef<HTMLAudioElement | null>(null);
  const washAudioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Smoothing refs for audio
  const smoothWashTimeRef = useRef(0);
  const smoothShutterTimeRef = useRef(2);
  const smoothVolRef = useRef(0);

  // Keep refs in sync for the render loop
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Audio Initialization
  useEffect(() => {
    const shutter = new Audio('/Audio/old-garage-door-opening-audio.mp3');
    shutter.volume = 0;
    shutter.preload = 'auto';
    shutterAudioRef.current = shutter;

    const wash = new Audio('/Audio/Car%20wash%20audio.mp3');
    wash.volume = 0;
    wash.preload = 'auto';
    washAudioRef.current = wash;

    const handleFirstInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

    return () => {
      shutter.pause();
      wash.pause();
      shutterAudioRef.current = null;
      washAudioRef.current = null;
    };
  }, []);

  // Listeners and Draw loop
  useEffect(() => {
    if (!allLoaded) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const revealThreshold = 0.15;
        let frameIndex = 0;
        
        if (self.progress <= revealThreshold) {
          frameIndex = 0;
        } else {
          const adjustedProgress = (self.progress - revealThreshold) / (1 - revealThreshold);
          frameIndex = Math.floor(adjustedProgress * (TOTAL_FRAMES - 1));
        }

        if (frameIndex !== frameIndexRef.current) {
          frameIndexRef.current = frameIndex;
          needsDrawRef.current = true;
        }
      },
      onToggle: (self) => {
        setIsActive(self.isActive);
        isActiveRef.current = self.isActive;
        if (!self.isActive) {
          shutterAudioRef.current?.pause();
          washAudioRef.current?.pause();
        }
      }
    });

    let raf: number;
    const render = () => {
      // 1. Update Frames
      if (currentFrame !== frameIndexRef.current) {
        setCurrentFrame(frameIndexRef.current);
      }
      if (needsDrawRef.current) {
        drawFrame(frameIndexRef.current);
        needsDrawRef.current = false;
      }

      // 2. Manage Audio In Render Loop for instant stop and smoothness
      if (allLoaded && soundEnabledRef.current) {
        const revealThreshold = 0.15;
        const velocity = Math.abs(st.getVelocity());
        const progress = st.progress;

        const shutter = shutterAudioRef.current;
        const wash = washAudioRef.current;
        const currentIdx = frameIndexRef.current;

        if (velocity > 5 && isActiveRef.current && currentIdx < 165) {
          if (progress <= revealThreshold) {
            // SHUTTER PHASE
            if (wash) wash.pause();
            if (shutter) {
              const p = progress / revealThreshold;
              const targetTime = 2 + (p * 1.95);
              
              const drift = Math.abs(shutter.currentTime - targetTime);
              if (drift > 0.12) {
                shutter.muted = true; // Kill beeps during seek
                shutter.currentTime = targetTime;
                shutter.muted = false;
              }

              shutter.volume = Math.min(Math.max(velocity / 400, 0.4), 1.0);
              if (shutter.paused) shutter.play().catch(() => {});
            }
          } else {
            // WASH PHASE
            if (shutter) shutter.pause();
            if (wash) {
              const washP = (progress - revealThreshold) / (1 - revealThreshold);
              const targetTime = washP * 5.95;

              const drift = Math.abs(wash.currentTime - targetTime);
              if (drift > 0.12) {
                wash.muted = true; // Kill beeps during seek
                wash.currentTime = targetTime;
                wash.muted = false;
              }

              wash.volume = Math.min(Math.max(velocity / 600, 0.4), 0.95);
              if (wash.paused) wash.play().catch(() => {});
            }
          }
        } else {
          // INSTANT STOP
          if (shutter && !shutter.paused) {
            shutter.pause();
            shutter.volume = 0;
          }
          if (wash && !wash.paused) {
            wash.pause();
            wash.volume = 0;
          }
          smoothVolRef.current = 0;
        }
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      st.kill();
      cancelAnimationFrame(raf);
    };
  }, [allLoaded, soundEnabled]);



  const loadPercentage = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
  const isBackgroundLoading = allLoaded && loadedCount < TOTAL_FRAMES;

  return (
    <>
      {/* Floating Sound Toggle */}
      {allLoaded && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {!soundEnabled && !hasInteracted && (
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Inter',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              pointerEvents: 'none',
              animation: 'pulse 2s infinite'
            }}>
              CLICK TO ENABLE AUDIO
            </div>
          )}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: soundEnabled ? '#C8A96E' : '#1A1A1A',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'all 300ms ease',
              transform: soundEnabled ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {soundEnabled ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
          </button>
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.6; transform: translateX(0); }
              50% { opacity: 1; transform: translateX(-5px); }
              100% { opacity: 0.6; transform: translateX(0); }
            }
          `}</style>
        </div>
      )}

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
