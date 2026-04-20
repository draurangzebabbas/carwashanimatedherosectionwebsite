'use client';

import { useState } from 'react';
import CarWashScroll from '../components/CarWashScroll';

export default function Page() {
  return (
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
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '68px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 48px',
        backgroundColor: 'rgba(224,222,221,0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '20px', color: '#1A1A1A' }}>SPARKLE</span>
          <span style={{ color: '#C8A96E', fontSize: '8px', marginLeft: '2px' }}>●</span>
        </div>
        
        <div className="nav-links" style={{ display: 'flex', gap: '36px' }}>
          {['Services', 'How It Works', 'Pricing', 'Contact'].map(text => (
            <HoverLink key={text} text={text} />
          ))}
        </div>

        <HoverButton text="Book Now" primary={true} />
      </nav>

      {/* B. HERO SECTION INTRO */}
      <div style={{ paddingTop: '140px', paddingBottom: '40px', backgroundColor: '#E0DEDD', textAlign: 'center' }}>
        <h1 style={{ 
          fontFamily: 'Inter', 
          fontWeight: 800, 
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
          color: '#1A1A1A', 
          margin: 0, 
          letterSpacing: '-0.02em', 
          lineHeight: 1.1 
        }}>
          Premium Care for <br/><span style={{ color: '#C8A96E' }}>Your Vehicle</span>
        </h1>
        <p style={{ 
          fontFamily: 'Inter', 
          fontSize: '1.2rem', 
          color: '#6B6B6B', 
          marginTop: '20px', 
          maxWidth: '600px', 
          margin: '20px auto 0' 
        }}>
          Scroll down to experience our interactive wash process from start to finish.
        </p>
      </div>

      {/* C. SCROLL ANIMATION SECTION */}
      <div style={{ paddingTop: '0px' }}>
        <CarWashScroll />
      </div>


      {/* C. STATS BAR */}
      <div style={{ backgroundColor: '#181818', padding: '56px 48px' }}>
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

      {/* D. SERVICES SECTION */}
      <div style={{ backgroundColor: '#E0DEDD', padding: '120px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '14px', fontFamily: 'Inter', fontWeight: 500, fontSize: '11px', color: '#C8A96E', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            OUR SERVICES
          </div>
          <div style={{ marginBottom: '16px', fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1A1A1A' }}>
            Choose Your Package
          </div>
          <div style={{ marginBottom: '72px', fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', color: '#6B6B6B', maxWidth: '460px', lineHeight: '1.7' }}>
            Every wash is performed by trained professionals using premium products
          </div>

          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <ServiceCard 
              icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4C18 4 8 16 8 22a10 10 0 0020 0C28 16 18 4 18 4z" fill="#C8A96E"/></svg>}
              title="Basic Wash"
              price="Rs 500"
              features={['Exterior rinse', 'Soap wash', 'Wheel clean', 'Hand dry']}
              buttonStyle="outline"
              popular={false}
            />
            <ServiceCard 
              icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4l2.5 9.5H30l-8 5.8 3 9.7-7-5.1-7 5.1 3-9.7-8-5.8h9.5z" fill="#C8A96E"/></svg>}
              title="Premium Wash"
              price="Rs 1,200"
              features={['Everything in Basic', 'Interior vacuum', 'Dashboard wipe', 'Air freshener', 'Window polish']}
              buttonStyle="primary"
              popular={true}
            />
            <ServiceCard 
              icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 3L6 8v10c0 7.7 5.1 14.9 12 17 6.9-2.1 12-9.3 12-17V8L18 3z" fill="#C8A96E"/></svg>}
              title="Full Detail"
              price="Rs 2,500"
              features={['Everything in Premium', 'Clay bar treatment', 'Paint polish', 'Wax coating', 'Engine bay clean']}
              buttonStyle="outline"
              popular={false}
            />
          </div>
        </div>
      </div>

      {/* E. HOW IT WORKS */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '120px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '72px' }}>
           <div style={{ marginBottom: '14px', fontFamily: 'Inter', fontWeight: 500, fontSize: '11px', color: '#C8A96E', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            THE PROCESS
          </div>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1A1A1A' }}>
            Simple as 1, 2, 3
          </div>
        </div>
        <div className="process-stack" style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', justifyContent: 'space-between' }}>
          <ProcessStep 
            number="01" 
            icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="20" rx="3" stroke="#C8A96E" strokeWidth="2"/><path d="M3 11h22" stroke="#C8A96E" strokeWidth="2"/><path d="M9 3v4M19 3v4" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"/></svg>}
            title="Book Online"
            desc="Choose your service, pick a date and time that works for you"
          />
          <div className="process-connector" style={{ flex: '0 0 80px', borderTop: '2px dashed rgba(0,0,0,0.1)', marginTop: '40px' }} />
          <ProcessStep 
            number="02" 
            icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3a8 8 0 018 8c0 6-8 14-8 14S6 17 6 11a8 8 0 018-8z" stroke="#C8A96E" strokeWidth="2"/><circle cx="14" cy="11" r="3" stroke="#C8A96E" strokeWidth="2"/></svg>}
            title="We Come to You"
            desc="Our team arrives at your location fully equipped and ready"
          />
          <div className="process-connector" style={{ flex: '0 0 80px', borderTop: '2px dashed rgba(0,0,0,0.1)', marginTop: '40px' }} />
          <ProcessStep 
            number="03" 
            icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3v22M3 14h22M7 7l14 14M21 7L7 21" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"/></svg>}
            title="Drive Away Shining"
            desc="Sit back, relax, and enjoy your freshly detailed car"
          />
        </div>
      </div>

      {/* F. TESTIMONIALS */}
      <div style={{ backgroundColor: '#181818', padding: '120px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '72px' }}>
          <div style={{ marginBottom: '14px', fontFamily: 'Inter', fontWeight: 500, fontSize: '11px', color: '#C8A96E', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            REVIEWS
          </div>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF' }}>
            What Our Customers Say
          </div>
        </div>
        <div className="reviews-stack" style={{ display: 'flex', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <ReviewCard 
            quote="&quot;My car has never looked this good. The premium package is absolutely worth every rupee.&quot;"
            name="Ahmed K."
            city="Lahore"
          />
          <ReviewCard 
            quote="&quot;Booked online in 2 minutes and they were at my door in the morning. Incredible service.&quot;"
            name="Sara M."
            city="Islamabad"
          />
          <ReviewCard 
            quote="&quot;The full detail made my 5 year old car look brand new. Highly recommend the wax coating.&quot;"
            name="Usman R."
            city="Karachi"
          />
        </div>
      </div>

      {/* G. BOOKING CTA BANNER */}
      <div style={{ backgroundColor: '#C8A96E', padding: '100px 48px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#1A1A1A' }}>
          Ready for a Cleaner Car?
        </div>
        <div style={{ marginTop: '16px', marginBottom: '44px', fontFamily: 'Inter', fontWeight: 400, fontSize: '17px', color: 'rgba(0,0,0,0.55)' }}>
          Book your wash today and drive away shining
        </div>
        <HoverButton text="Book Now" primary={true} large={true} cta={true} />
      </div>

      {/* H. FOOTER */}
      <div style={{ backgroundColor: '#181818', paddingTop: '80px', paddingBottom: '40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '64px', maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '20px', color: '#FFFFFF' }}>SPARKLE.</div>
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
             {['+92 300 1234567', 'hello@sparkle.pk', 'Lahore, Pakistan'].map((text, i) => (
                <div key={i} style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '12px', display: 'block' }}>
                  {text}
                </div>
             ))}
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', marginTop: '60px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingLeft: '48px', paddingRight: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
            © 2025 Sparkle. All rights reserved.
          </div>
          <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
            Made with ♥ in Pakistan
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// HELPER COMPONENTS
// -----------------------------------------------------------------------------

function HoverLink({ text }: { text: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a 
      href="#" 
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
      <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '6px', textAlign: 'center' }}>
        {label}
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, price, features, buttonStyle, popular }: { icon: React.ReactNode, title: string, price: string, features: string[], buttonStyle: 'primary' | 'outline', popular: boolean }) {
  const [hover, setHover] = useState(false);

  return (
    <div 
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: '20px',
        padding: '40px 32px',
        position: 'relative',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        cursor: 'pointer',
        transform: hover ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hover ? '0 24px 64px rgba(0,0,0,0.09)' : 'none',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {popular && (
        <div style={{ position: 'absolute', top: '24px', right: '24px', background: '#1A1A1A', color: '#FFFFFF', fontSize: '11px', fontFamily: 'Inter', fontWeight: 600, padding: '4px 14px', borderRadius: '100px' }}>
          Most Popular
        </div>
      )}
      <div style={{ marginBottom: '24px' }}>
        {icon}
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '22px', color: '#1A1A1A', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '32px', color: '#C8A96E', marginBottom: '28px' }}>
        {price}
      </div>
      <div style={{ flex: 1 }}>
        {features.map((feat, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: '#C8A96E', fontSize: '14px', flexShrink: 0 }}>✓</span>
            <span style={{ color: '#6B6B6B', fontSize: '14px', fontFamily: 'Inter', lineHeight: 1.4 }}>{feat}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '32px' }}>
        <button
          style={{
            background: hover ? (buttonStyle === 'primary' ? '#C8A96E' : '#1A1A1A') : (buttonStyle === 'primary' ? '#1A1A1A' : 'transparent'),
            color: hover ? (buttonStyle === 'primary' ? '#1A1A1A' : '#FFFFFF') : (buttonStyle === 'primary' ? '#FFFFFF' : '#1A1A1A'),
            border: buttonStyle === 'primary' ? 'none' : '1.5px solid #1A1A1A',
            padding: '12px 28px',
            borderRadius: '100px',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
            transition: 'background 200ms ease, color 200ms ease'
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function ProcessStep({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '80px', color: 'rgba(0,0,0,0.05)', lineHeight: 1, marginBottom: '8px' }}>
        {number}
      </div>
      <div style={{ marginBottom: '16px' }}>
        {icon}
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', color: '#1A1A1A', marginBottom: '10px' }}>
        {title}
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: '#6B6B6B', maxWidth: '200px', lineHeight: '1.65', margin: '0 auto' }}>
        {desc}
      </div>
    </div>
  );
}

function ReviewCard({ quote, name, city }: { quote: string, name: string, city: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px', flex: 1 }}>
      <div style={{ color: '#C8A96E', fontSize: '14px', letterSpacing: '2px', marginBottom: '20px' }}>
        ★★★★★
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.75', marginBottom: '28px' }}>
        {quote}
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>
        {name}
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>
        {city}
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
