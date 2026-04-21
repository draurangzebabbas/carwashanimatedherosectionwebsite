'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const testimonials = [
  { name: "Ahmed K.", city: "Lahore", quote: "My car has never looked this good. The premium package is absolutely worth every rupee.", rating: 5 },
  { name: "Sara M.", city: "Islamabad", quote: "Booked online in 2 minutes and they were at my door in the morning. Incredible service.", rating: 5 },
  { name: "Usman R.", city: "Karachi", quote: "The full detail made my 5 year old car look brand new. Highly recommend the wax coating.", rating: 5 },
  { name: "Zainab B.", city: "Faisalabad", quote: "Fast, efficient and they really care about the details. Best mobile wash in town.", rating: 5 },
  { name: "Bilal S.", city: "Peshawar", quote: "I love the way they handle everything. No mess left behind, just a shiny car.", rating: 5 },
  { name: "Maya J.", city: "Lahore", quote: "Professional crew and top-tier equipment. My husband was so impressed he booked his SUV too.", rating: 5 },
];

const Row = ({ items, direction = 'left' }: { items: typeof testimonials, direction: 'left' | 'right' }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    // Use a small timeout to ensure layout/scrollWidth is ready
    const timer = setTimeout(() => {
      const scrollWidth = row.scrollWidth;
      const singleSetWidth = scrollWidth / 3; // Since we render 3 copies
      const pixelsPerSecond = 50; // Stable speed for both rows
      const duration = singleSetWidth / pixelsPerSecond;

      // Kill previous animations if any
      gsap.killTweensOf(row);

      if (direction === 'left') {
        gsap.set(row, { x: 0 });
        gsap.to(row, {
          x: -singleSetWidth,
          duration: duration,
          ease: 'none',
          repeat: -1,
        });
      } else {
        gsap.set(row, { x: -singleSetWidth });
        gsap.to(row, {
          x: 0,
          duration: duration,
          ease: 'none',
          repeat: -1,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [direction, items]);

  return (
    <div style={{ overflow: 'hidden', width: '100vw', margin: '15px 0' }}>
      <div 
        ref={rowRef} 
        style={{ 
          display: 'flex', 
          gap: '30px', 
          whiteSpace: 'nowrap',
          width: 'max-content',
          willChange: 'transform'
        }}
      >
        {[...items, ...items, ...items].map((item, idx) => (
          <div 
            key={idx}
            style={{
              flexShrink: 0,
              width: '400px',
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '24px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              cursor: 'default',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            <div style={{ color: '#C8A96E', fontSize: '14px', letterSpacing: '2px' }}>
              {"★".repeat(item.rating)}
            </div>
            <p style={{ 
              fontFamily: 'Inter, sans-serif', 
              fontSize: '16px', 
              color: 'rgba(255, 255, 255, 0.8)', 
              lineHeight: '1.6',
              whiteSpace: 'normal',
              margin: 0
            }}>
              "{item.quote}"
            </p>
            <div style={{ marginTop: '5px' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>
                {item.name}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>
                {item.city}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TestimonialMarquee() {
  return (
    <section style={{ 
      backgroundColor: '#181818', 
      padding: '40px 0 80px', 
      overflow: 'hidden',
      position: 'relative',
      zIndex: 20
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '60px', padding: '0 48px' }}>
        <div style={{ 
          marginBottom: '14px', 
          fontFamily: 'Inter', 
          fontWeight: 500, 
          fontSize: '11px', 
          color: '#C8A96E', 
          letterSpacing: '0.2em', 
          textTransform: 'uppercase' 
        }}>
          TESTIMONIALS
        </div>
        <h2 style={{ 
          fontFamily: 'Inter', 
          fontWeight: 700, 
          fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
          color: '#FFFFFF',
          margin: 0,
          background: 'linear-gradient(to bottom, #FFFFFF, rgba(255,255,255,0.7))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Trusted by Car Enthusiasts
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
        <Row items={testimonials} direction="left" />
        <Row items={testimonials.slice().reverse()} direction="right" />
      </div>
    </section>
  );
}
