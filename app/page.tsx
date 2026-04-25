'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Crown } from 'lucide-react';
import CarWashScroll from '../components/CarWashScroll';
import TheProcess from '../components/TheProcess'
import SmoothScroll from '../components/SmoothScroll';
import TestimonialMarquee from '../components/TestimonialMarquee';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getCalApi } from "@calcom/embed-react";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Page() {
  useEffect(() => {
    // Refresh ScrollTrigger after a short delay to account for CarWashScroll initialization
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    // Premium reveal animations for sections
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((section) => {
      // Set initial state via CSS-in-JS style to prevent flash of content
      (section as HTMLElement).style.opacity = '0';
      (section as HTMLElement).style.transform = 'translateY(30px)';

      gsap.to(section, { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      });
    });

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"thedailydriver"});
      cal("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#B8975D"},"dark":{"cal-brand":"#B8975D"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  return (
    <SmoothScroll>
      <div style={{ backgroundColor: '#E0DEDD', minHeight: '100vh', wordBreak: 'break-word' }}>
        <style>{`
          @media (max-width: 768px) {
            .nav-links { display: none !important; }
            .stats-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
            .stats-divider { display: none !important; }
            .services-grid { grid-template-columns: 1fr !important; }
            .process-stack { flex-direction: column !important; }
            .process-connector { display: none !important; }
            .reviews-stack { flex-direction: column !important; }
            .footer-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .stats-grid { grid-template-columns: 1fr !important; }
            .footer-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* A. FIXED NAVBAR */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 1000, height: '67px', width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px',
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '0 0 24px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '20px', color: '#1A1A1A' }}>VALEOWASH</span>
            <span style={{ color: '#C8A96E', fontSize: '8px', marginLeft: '2px' }}>●</span>
          </div>

          <div className="nav-links" style={{ display: 'flex', gap: '36px' }}>
            {[
              { text: 'Packages', href: '#packages' },
              { text: 'The Process', href: '#process' },
              { text: 'About us', href: '#about' },
              { text: 'Contact', href: '#footer' }
            ].map(item => (
              <HoverLink key={item.text} text={item.text} href={item.href} />
            ))}
          </div>

          <button 
            onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: '#1A1A1A',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 28px',
              borderRadius: '100px',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 200ms ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C8A96E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
          >
            Book Now
          </button>
        </nav>

        {/* B. HERO SECTION INTRO */}
        <div style={{
          position: 'relative',
          zIndex: 20,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E0DEDD',
          /* SCROLLING BACKGROUND: Moves with the page like a real door */
          background: `
            linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 30%, rgba(0,0,0,0.1) 100%),
            repeating-linear-gradient(
              to bottom,
              #E5E3E2 0px,
              #F8F7F6 1px,
              #E0DEDD 4px,
              #D4D2D1 36px,
              #A3A1A0 39px,
              #82807F 40px
            )
          `,
          textAlign: 'center',
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* METALLIC GRIT OVERLAY */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            zIndex: 1
          }} />

          {/* STRUCTURAL VERTICAL RAILS (With Groove Detail) */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '28px',
            background: `
              linear-gradient(to right, #000, #222 30%, #111 50%, #222 70%, #000),
              repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(255,255,255,0.02) 5px)
            `,
            zIndex: 15, borderRight: '1px solid #333'
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '28px',
            background: `
              linear-gradient(to left, #000, #222 30%, #111 50%, #222 70%, #000),
              repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(255,255,255,0.02) 5px)
            `,
            zIndex: 15, borderLeft: '1px solid #333'
          }} />

          {/* MASTER SHUTTER PROJECTION (Ties text and background together) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              repeating-linear-gradient(
                to bottom,
                rgba(255,255,255,0.4) 0px,
                rgba(255,255,255,0.1) 2px,
                transparent 4px,
                transparent 35px,
                rgba(0,0,0,0.15) 36px,
                rgba(0,0,0,0.4) 38px,
                rgba(0,0,0,0.2) 39px,
                transparent 40px
              )
            `,
            pointerEvents: 'none',
            zIndex: 10
          }} />

          <div style={{ position: 'relative', zIndex: 5 }}>
            <h1 style={{
              fontFamily: 'Inter',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              color: '#1A1A1A',
              textAlign: 'center',
              opacity: 0.98,
              filter: 'drop-shadow(0px 1px 0px rgba(255,255,255,0.4))',
              paddingBottom: '20px'
            }}>
              Premium Care for <br />
              <span style={{
                display: 'block',
                marginTop: '12px',
                color: '#B8975D',
              }}>Your Vehicle</span>
            </h1>

            <p style={{
              fontFamily: 'Inter',
              fontSize: '1.05rem',
              marginTop: '32px',
              maxWidth: '620px',
              margin: '32px auto 0',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#444444',
              opacity: 0.8
            }}>
              Scroll down to experience our interactive wash process from start to finish.
            </p>
          </div>
        </div>

        {/* C. SCROLL ANIMATION SECTION */}
        <div style={{ paddingTop: '0px' }}>
          <CarWashScroll />
        </div>

        {/* C. STATS BAR (Black Background) */}
        <div id="about" className="reveal-section" style={{ position: 'relative', zIndex: 20, backgroundColor: '#111111', padding: '80px 48px' }}>
          <div className="stats-grid" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
            <StatBox number="2,400+" label="Happy Customers" />
            <div className="stats-divider" style={{ width: '1px', height: '44px', background: 'rgba(255,255,255,0.1)' }} />
            <StatBox number="8 Min" label="Average Wash Time" />
            <div className="stats-divider" style={{ width: '1px', height: '44px', background: 'rgba(255,255,255,0.1)' }} />
            <StatBox number="100%" label="Satisfaction Rate" />
            <div className="stats-divider" style={{ width: '1px', height: '44px', background: 'rgba(255,255,255,0.1)' }} />
            <StatBox number="5 Star" label="Rated Service" />
          </div>
        </div>

        {/* D. THE PROCESS */}
        <div style={{ margin: 0, padding: 0, backgroundColor: '#E0DEDD' }}>
          <TheProcess />
        </div>

        {/* E. SERVICES SECTION (PACKAGES) */}
        <section id="packages" className="reveal-section" style={{ position: 'relative', zIndex: 20, backgroundColor: '#E0DEDD', padding: '20px 48px 80px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '14px', fontFamily: 'Inter', fontWeight: 500, fontSize: '11px', color: '#C8A96E', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              OUR PACKAGES
            </div>
            <div style={{ marginBottom: '16px', fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1A1A1A', lineHeight: '1.2' }}>
              Your Car. Your Schedule. Your Door.
            </div>
            <div style={{ marginBottom: '72px', fontFamily: 'Inter', fontWeight: 400, fontSize: '18px', color: '#6B6B6B', maxWidth: '540px', lineHeight: '1.6' }}>
              Book in 60 seconds. We show up with everything. You just hand us the keys.
            </div>

            <PackagesGrid />
          </div>
        </section>

        {/* F. TESTIMONIALS (Moved after Packages) */}
        <div className="reveal-section" style={{ margin: 0, padding: 0, backgroundColor: '#181818' }}>
          <TestimonialMarquee />
        </div>

        {/* G. BOOKING CTA BANNER */}
        <div style={{ position: 'relative', zIndex: 20, backgroundColor: '#C8A96E', padding: '100px 48px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#1A1A1A' }}>
            Ready for a Cleaner Car?
          </div>
          <div style={{ marginTop: '16px', marginBottom: '44px', fontFamily: 'Inter', fontWeight: 400, fontSize: '17px', color: 'rgba(0,0,0,0.55)' }}>
            Book your wash today and drive away shining
          </div>
          <button 
            onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: '#1A1A1A',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px 48px',
              borderRadius: '100px',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              marginTop: '44px',
              transition: 'background 200ms ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.75)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
          >
            Choose Your Package
          </button>
        </div>

        {/* H. FOOTER */}
        <div id="footer" style={{ position: 'relative', zIndex: 20, backgroundColor: '#181818', paddingTop: '80px', paddingBottom: '40px' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '64px', maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '20px', color: '#FFFFFF' }}>VALEOWASH.</div>
              <div style={{ marginTop: '16px', fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,0.35)', maxWidth: '200px', lineHeight: '1.6' }}>
                Premium car wash services delivered to your door
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>SERVICES</div>
              {['Basic Wash', 'Premium Wash', 'Full Detail', 'Fleet Washing'].map(link => (
                <FooterLink key={link} text={link} />
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>COMPANY</div>
              {['About Us', 'How It Works', 'Reviews', 'Contact Us'].map(link => (
                <FooterLink key={link} text={link} />
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>CONTACT</div>
              {['+92 300 1234567', 'hello@valeowash.pk', 'Lahore, Pakistan'].map((text, i) => (
                <div key={i} style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '12px', display: 'block' }}>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', marginTop: '60px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingLeft: '48px', paddingRight: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
              © 2025 ValeoWash. All rights reserved.
            </div>
            <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
              Made with ♥ in Pakistan
            </div>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}

// -----------------------------------------------------------------------------
// HELPER COMPONENTS
// -----------------------------------------------------------------------------

function PackagesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const packages = [
    {
      icon: Sparkles,
      title: "The Daily Driver",
      tagline: "Your car sees everything you do. Keep it clean.",
      price: "$49",
      subPrice: "$59 for SUV/Truck",
      oneLiner: "Exterior refresh: 45m (Sedan) / 60m (SUV). Perfect for every 2–3 weeks.",
      features: ['Premium foam hand wash — exterior', 'Wheel and rim scrub', 'Tyre dressing — jet black finish', 'All windows exterior cleaned', 'Hand dried with microfibre towels', 'Door jambs wiped'],
      buttonText: "Get It Done",
      popular: false,
      calLink: "ahmed-ameen-rwdyc0/thedailydriver"
    },
    {
      icon: RefreshCw,
      title: "The Sunday Reset",
      tagline: "Start the week feeling like everything is in order.",
      price: "$99",
      subPrice: "$119 for SUV/Truck",
      oneLiner: "Deep Clean: 90m (Sedan) / 120m (SUV). The wash that makes your car feel new.",
      features: ['Everything in The Daily Driver', 'Full interior vacuum including boot and under seats', 'Dashboard, console, vents, and door panels detailed', 'Cup holders deep cleaned', 'Interior windows cleaned streak-free', 'Leather or fabric seats wiped and conditioned', 'Premium car scent applied', 'Tyre shine'],
      buttonText: "Book My Reset",
      popular: true,
      calLink: "ahmed-ameen-rwdyc0/the-sunday-reset"
    },
    {
      icon: Crown,
      title: "The White Glove",
      tagline: "For when your car deserves to be treated like it just left the showroom.",
      price: "$199",
      subPrice: "$249 for SUV/Truck",
      oneLiner: "Showroom Detail: 4h (Sedan) / 6h (SUV). The full high-end restoration.",
      features: ['Everything in The Sunday Reset', 'Clay bar treatment — removes all bonded contamination from paint', 'Machine orbital polish — removes light scratches and swirl marks', 'Hand applied carnauba wax — protection for 3 months', 'Engine bay detail and clean', 'Headlight polish and restoration', 'Full interior shampoo — carpets and seats', 'Odour elimination treatment', 'Tyre and rim deep restore'],
      buttonText: "Book White Glove",
      popular: false,
      calLink: "ahmed-ameen-rwdyc0/the-white-glove"
    }
  ];

  const handleBooking = async (calLink: string) => {
    const cal = await getCalApi({"namespace":"thedailydriver"});
    cal("modal", {
      calLink: calLink,
      config: {"layout":"month_view"}
    });
  };

  return (
    <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      {packages.map((pkg, i) => (
        <ServiceCard
          key={i}
          {...pkg}
          isFocused={hoveredIndex === i}
          isDimmed={hoveredIndex !== null && hoveredIndex !== i}
          onHover={() => setHoveredIndex(i)}
          onLeave={() => setHoveredIndex(null)}
          onClick={() => handleBooking(pkg.calLink)}
        />
      ))}
    </div>
  );
}

function HoverLink({ text, href }: { text: string, href: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'Inter', fontWeight: 500, fontSize: '14px',
        color: hover ? '#1A1A1A' : '#6B6B6B',
        textDecoration: 'none',
        transition: 'color 200ms ease'
      }}
    >
      {text}
    </a>
  );
}

function HoverButton({ text, primary, large, cta }: { text: string, primary: boolean, large?: boolean, cta?: boolean }) {
  const [hover, setHover] = useState(false);
  const baseBg = primary ? '#1A1A1A' : 'transparent';
  const hoverBg = primary ? (cta ? 'rgba(0,0,0,0.75)' : '#C8A96E') : '#1A1A1A';
  const baseColor = primary ? '#FFFFFF' : '#1A1A1A';
  const hoverColor = primary ? (cta ? '#FFFFFF' : '#1A1A1A') : '#FFFFFF';
  const border = primary ? 'none' : '1.5px solid #1A1A1A';

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? hoverBg : baseBg,
        color: hover ? hoverColor : baseColor,
        border: border,
        padding: large ? '14px 48px' : '10px 28px',
        borderRadius: '100px',
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: large ? '15px' : '14px',
        cursor: 'pointer',
        transition: 'background 200ms ease, color 200ms ease',
      }}
    >
      {text}
    </button>
  );
}

function StatBox({ number, label }: { number: string, label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 48px', flex: 1 }}>
      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#C8A96E' }}>
        {number}
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '6px', textAlign: 'center' }}>
        {label}
      </div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, tagline, price, subPrice, oneLiner, features, buttonText, popular, isFocused, isDimmed, onHover, onLeave, onClick }: { icon: React.ElementType, title: string, tagline: string, price: string, subPrice: string, oneLiner: string, features: string[], buttonText: string, popular: boolean, isFocused: boolean, isDimmed: boolean, onHover: () => void, onLeave: () => void, onClick: () => void }) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        border: popular ? (isFocused ? '2px solid #C8A96E' : '2px solid #1A1A1A') : '1px solid rgba(0,0,0,0.07)',
        borderRadius: '24px',
        padding: '48px 32px 40px',
        position: 'relative',
        transition: 'all 500ms cubic-bezier(0.23, 1, 0.32, 1)',
        cursor: 'pointer',
        opacity: isDimmed ? 0.6 : 1,
        transform: popular ? (isFocused ? 'translateY(-16px) scale(1.02)' : 'translateY(-4px)') : (isFocused ? 'translateY(-8px)' : 'translateY(0)'),
        boxShadow: popular
          ? (isFocused ? '0 40px 80px rgba(200, 169, 110, 0.15)' : '0 16px 48px rgba(0,0,0,0.08)')
          : (isFocused ? '0 24px 48px rgba(0,0,0,0.06)' : 'none'),
        display: 'flex',
        flexDirection: 'column',
        zIndex: isFocused ? 10 : (popular ? 2 : 1),
        filter: isDimmed ? 'grayscale(0.2) blur(0.5px)' : 'none',
      }}
    >
      {popular && (
        <div style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1A1A1A',
          color: '#FFFFFF',
          fontSize: '11px',
          fontFamily: 'Inter',
          fontWeight: 700,
          padding: '6px 16px',
          borderRadius: '100px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Most Popular
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <Icon size={36} color="#C8A96E" strokeWidth={1.5} />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '22px', color: '#1A1A1A', marginBottom: '4px', lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'italic', fontSize: '13px', color: '#6B6B6B' }}>
          {tagline}
        </p>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '32px', color: '#C8A96E', lineHeight: 1 }}>
          {price}
        </div>
        <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '6px' }}>
          {subPrice}
        </div>
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', width: '100%', marginTop: '20px' }} />
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: '#444', marginTop: '16px', lineHeight: 1.5 }}>
          {oneLiner}
        </p>
      </div>

      <div style={{ flex: 1, marginBottom: '32px' }}>
        {features.map((feat, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'flex-start' }}>
            <span style={{
              color: '#C8A96E',
              fontSize: '12px',
              flexShrink: 0,
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              background: 'rgba(200, 169, 110, 0.1)',
              borderRadius: '50%'
            }}>✓</span>
            <span style={{ color: '#555', fontSize: '14px', fontFamily: 'Inter', lineHeight: 1.45 }}>{feat}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button
          style={{
            background: popular ? '#C8A96E' : (isFocused ? '#1A1A1A' : '#F5f5f5'),
            color: popular ? '#1A1A1A' : (isFocused ? '#FFFFFF' : '#6B6B6B'),
            border: 'none',
            padding: '16px 28px',
            borderRadius: '12px',
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 300ms ease',
            boxShadow: popular ? '0 8px 20px rgba(200, 169, 110, 0.25)' : (isFocused ? '0 8px 20px rgba(0,0,0,0.1)' : 'none'),
            transform: isFocused ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function FooterLink({ text }: { text: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'Inter', fontWeight: 400, fontSize: '14px',
        color: hover ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
        textDecoration: 'none',
        transition: 'color 200ms ease',
        display: 'block',
        marginBottom: '12px'
      }}
    >
      {text}
    </a>
  );
}
