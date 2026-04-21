'use client';

import { useEffect, useRef, useState } from 'react';
import { Smartphone, Truck, Sparkles, LucideIcon } from 'lucide-react';

interface StepProps {
  number: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  index: number;
  isVisible: boolean;
}

function Step({ number, icon: Icon, title, desc, index, isVisible }: StepProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      textAlign: 'left',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 700ms ease ${index * 150}ms, transform 700ms ease ${index * 150}ms`,
    }}>
      <div style={{
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: '72px',
        color: 'rgba(200, 169, 110, 0.15)',
        lineHeight: 1,
        marginBottom: '-16px',
        zIndex: 1
      }}>
        {number}
      </div>
      
      <div className={`icon-box icon-box-${index}`} style={{
        width: '56px',
        height: '56px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '28px',
        position: 'relative',
        zIndex: 2,
        animation: `breathe 4s ease-in-out infinite ${index * 1.3}s`
      }}>
        <Icon size={22} color="#C8A96E" strokeWidth={1.5} />
      </div>

      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)', color: '#1A1A1A', marginBottom: '12px' }}>
        {title}
      </div>

      <div style={{ width: '28px', height: '2px', backgroundColor: '#C8A96E', borderRadius: '2px', marginBottom: '16px' }} />

      <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: '#6B6B6B', lineHeight: 1.75, maxWidth: '260px' }}>
        {desc}
      </div>
    </div>
  );
}

export default function TheProcess() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "01",
      icon: Smartphone,
      title: "Book in 60 Seconds",
      desc: "Pick your package, drop your address, choose a time slot. Morning, afternoon, or weekend — we work around you. No phone calls. No waiting."
    },
    {
      number: "02",
      icon: Truck,
      title: "We Arrive Fully Equipped",
      desc: "Our team shows up with everything — water, power, premium products, and professional equipment. You do not need to provide anything. Just hand us the keys and go about your day."
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Drive Away Spotless",
      desc: "In 45 to 90 minutes your car is done. We notify you when it is ready. Walk out, inspect it, and drive away in a car that looks and smells brand new."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="process" 
      style={{ 
        position: 'relative', 
        zIndex: 20, 
        backgroundColor: '#E0DEDD', 
        padding: '20px 48px 20px',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,169,110,0); transform: scale(1); }
          50% { box-shadow: 0 0 0 8px rgba(200,169,110,0.06); transform: scale(1.02); }
        }
        .process-grid {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          justify-content: space-between;
          position: relative;
        }
        @media (max-width: 768px) {
          .process-grid { flex-direction: column !important; }
          .process-connector { display: none !important; }
          .process-step-container { margin-bottom: 48px; }
          section#process { padding: 80px 24px !important; }
        }
      `}</style>

      {/* TOP HEADING BLOCK */}
      <div style={{ maxWidth: '700px', margin: '0 auto 100px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', fontFamily: 'Inter', fontWeight: 500, fontSize: '11px', color: '#C8A96E', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          THE PROCESS
        </div>
        <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '20px' }}>
          From Your Phone to Your Driveway
        </h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#6B6B6B', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
          In three steps, your car goes from dirty to showroom clean — without you going anywhere.
        </p>
      </div>

      {/* THREE STEPS WITH ANIMATED LINE */}
      <div className="process-grid">
        {/* The Animated Line Layer */}
        <div className="process-connector" style={{
          position: 'absolute',
          top: '95px', // Aligns to vertical center of icon area (icon starts after 72-16=56px number height)
          left: '28px',
          right: '28px',
          height: '2px',
          background: 'rgba(200, 169, 110, 0.3)',
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(to right, #C8A96E, rgba(200,169,110,0.3))',
            width: isVisible ? '100%' : '0%',
            transition: 'width 1800ms ease-out'
          }} />
        </div>

        {steps.map((step, i) => (
          <div key={i} className="process-step-container" style={{ flex: 1 }}>
            <Step 
              {...step} 
              index={i} 
              isVisible={isVisible} 
            />
          </div>
        ))}
      </div>

      {/* BOTTOM TRUST LINE */}
      <div style={{ 
        marginTop: '80px', 
        textAlign: 'center', 
        fontFamily: 'Inter', 
        fontSize: '13px', 
        color: 'rgba(0,0,0,0.4)', 
        fontWeight: 400 
      }}>
        ⭐ Trusted by 2,400+ car owners — average booking takes 60 seconds, average wash takes 60 minutes.
      </div>
    </section>
  );
}
