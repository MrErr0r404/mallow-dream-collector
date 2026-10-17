import React, { useContext, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { SoundContext } from '../App';
import usePointerReaction from '../hooks/usePointerReaction';
import './Hero.css';

// Rich SVG fallback data URL in case /images/mallow-hero.jpg is not yet populated
const MALLOW_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <radialGradient id="skyGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="%23eee7ff"/>
      <stop offset="60%" stop-color="%23d8c8f8"/>
      <stop offset="100%" stop-color="%23bba4ec"/>
    </radialGradient>
    <radialGradient id="bodyGrad" cx="45%" cy="35%" r="65%">
      <stop offset="0%" stop-color="%23ffffff"/>
      <stop offset="65%" stop-color="%23e4d8fb"/>
      <stop offset="100%" stop-color="%23c7b5f5"/>
    </radialGradient>
    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23fff5cc"/>
      <stop offset="60%" stop-color="%23f4cc77"/>
      <stop offset="100%" stop-color="%23e5b342"/>
    </radialGradient>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <circle cx="250" cy="250" r="230" fill="url(%23skyGrad)"/>
  <circle cx="110" cy="180" r="34" fill="%23ffffff" opacity="0.35"/>
  <circle cx="390" cy="140" r="42" fill="%23ffffff" opacity="0.25"/>
  <circle cx="100" cy="360" r="46" fill="%23f4cc77" opacity="0.2"/>
  <circle cx="410" cy="330" r="30" fill="%23f6dce8" opacity="0.4"/>
  <ellipse cx="250" cy="225" rx="135" ry="150" fill="url(%23bodyGrad)"/>
  <path d="M120 280 C130 380 170 385 200 330 C225 385 275 385 300 330 C330 385 370 380 380 280 Z" fill="url(%23bodyGrad)"/>
  <ellipse cx="195" cy="265" rx="35" ry="22" transform="rotate(25 195 265)" fill="%23f3edff"/>
  <ellipse cx="305" cy="265" rx="35" ry="22" transform="rotate(-25 305 265)" fill="%23f3edff"/>
  <ellipse cx="205" cy="205" rx="22" ry="27" fill="%23211d3a"/>
  <ellipse cx="295" cy="205" rx="22" ry="27" fill="%23211d3a"/>
  <polygon points="196,195 198,199 203,200 199,203 200,208 196,205 192,208 193,203 189,200 194,199" fill="%23f4cc77"/>
  <circle cx="212" cy="216" r="5" fill="%23ffffff"/>
  <polygon points="286,195 288,199 293,200 289,203 290,208 286,205 282,208 283,203 279,200 284,199" fill="%23f4cc77"/>
  <circle cx="302" cy="216" r="5" fill="%23ffffff"/>
  <path d="M238 234 Q250 246 262 234" stroke="%235c4033" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="165" cy="235" rx="22" ry="12" fill="%23f6dce8" opacity="0.9"/>
  <ellipse cx="335" cy="235" rx="22" ry="12" fill="%23f6dce8" opacity="0.9"/>
  <g filter="url(%23softGlow)">
    <polygon points="250,95 258,125 288,133 262,152 270,182 250,162 230,182 238,152 212,133 242,125" fill="url(%23starGlow)"/>
  </g>
  <g transform="translate(250, 345)">
    <path d="M0 -55 C-20 -55 -20 -30 0 -30 C20 -30 20 -55 0 -55" stroke="%23d4a042" stroke-width="5" fill="none"/>
    <polygon points="0,-32 -42,-14 42,-14" fill="%23b88128"/>
    <rect x="-35" y="-14" width="70" height="70" rx="10" fill="%23fff5d6" opacity="0.88"/>
    <rect x="-35" y="-14" width="70" height="70" rx="10" fill="none" stroke="%23b88128" stroke-width="4"/>
    <polygon points="0,5 6,18 20,20 10,30 13,44 0,36 -13,44 -10,30 -20,20 -6,18" fill="url(%23starGlow)" filter="url(%23softGlow)"/>
    <rect x="-38" y="56" width="76" height="12" rx="4" fill="%23b88128"/>
  </g>
</svg>`;

/**
 * FloatingStars Component (inline)
 * 6 star elements positioned absolutely around the hero image with unique sizes, delays, and opacities
 */
function FloatingStars() {
  const stars = [
    { top: '8%', left: '8%', size: '22px', delay: '0s', opacity: 0.95, duration: '3.4s' },
    { top: '16%', right: '6%', size: '18px', delay: '0.8s', opacity: 0.85, duration: '2.8s' },
    { top: '48%', left: '2%', size: '16px', delay: '1.5s', opacity: 0.9, duration: '3.6s' },
    { top: '65%', right: '4%', size: '24px', delay: '2.2s', opacity: 0.95, duration: '3.2s' },
    { bottom: '12%', left: '12%', size: '14px', delay: '0.5s', opacity: 0.8, duration: '2.6s' },
    { bottom: '8%', right: '16%', size: '20px', delay: '1.8s', opacity: 0.88, duration: '3.0s' }
  ];

  return (
    <>
      {stars.map((star, idx) => (
        <span
          key={idx}
          className="floating-star"
          style={{
            top: star.top,
            bottom: star.bottom,
            left: star.left,
            right: star.right,
            fontSize: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            '--star-base-opacity': star.opacity
          }}
          aria-hidden="true"
        >
          ✦
        </span>
      ))}
    </>
  );
}

/**
 * ScrollCue Component (inline)
 * Centered bouncing cue below the hero leading to the next section
 */
function ScrollCue() {
  const handleScrollCue = () => {
    const target =
      document.getElementById('about') ||
      document.getElementById('creations') ||
      document.getElementById('story');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-scroll-cue-wrapper">
      <button
        type="button"
        className="hero-scroll-cue"
        onClick={handleScrollCue}
        aria-label="Scroll down to explore Mallow's world"
      >
        <span>scroll to explore</span>
        <ChevronDown size={18} className="scroll-cue-icon" />
      </button>
    </div>
  );
}

/**
 * Hero Component
 * The visually impressive hero banner introducing Mallow, The Little Dream Collector
 */
export default function Hero({ onOpenSecret, chaosMode = false, onToggleChaos }) {
  const soundContext = useContext(SoundContext) || {};
  const imageContainerRef = useRef(null);
  const { x, y } = usePointerReaction(imageContainerRef);
  const [isBouncing, setIsBouncing] = useState(false);
  const [heroClickCount, setHeroClickCount] = useState(0);

  const handleMallowClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    const nextCount = heroClickCount + 1;
    if (nextCount >= 5) {
      setHeroClickCount(0);
      if (typeof onOpenSecret === 'function') {
        onOpenSecret();
      }
    } else {
      setHeroClickCount(nextCount);
    }

    if (soundContext.playChime) {
      soundContext.playChime();
    } else if (soundContext.playStarPop) {
      soundContext.playStarPop();
    }
  };

  const handleExploreClick = () => {
    const creationsEl = document.getElementById('creations');
    if (creationsEl) {
      creationsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (soundContext.playStarPop) {
      soundContext.playStarPop();
    }
  };

  const handleMeetClick = () => {
    const aboutEl =
      document.getElementById('about') ||
      document.getElementById('story') ||
      document.getElementById('character');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (soundContext.playMusicBox) {
      soundContext.playMusicBox();
    }
  };

  return (
    <section className="hero-section" id="hero" aria-label="Welcome to Mallow's world">
      <div className="hero-content-wrapper">
        {/* Left Column: Text Content with Staggered Entrance Animations */}
        <div className="hero-text-col">
          {/* Label Badge — Delay: 0s */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <div className="hero-badge">
              <span className="hero-badge-sparkle" aria-hidden="true">✦</span>
              <span>CURRENTLY COLLECTING HAPPY MEMORIES</span>
            </div>
          </motion.div>

          {/* Large Heading — Delay: 0.15s */}
          <motion.h1
            className="hero-heading"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Oh, hello there,{' '}
            <span className="hero-heading-highlight">little dreamer.</span>
          </motion.h1>

          {/* Subheading — Delay: 0.3s */}
          <motion.p
            className="hero-subheading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            I'm Mallow, a tiny dream collector. I gather forgotten dreams and give unfinished
            stories their happy endings.
          </motion.p>

          {/* Action Buttons — Delay: 0.45s */}
          <motion.div
            className="hero-button-group"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <button
              type="button"
              className="hero-btn hero-btn-primary"
              onClick={handleExploreClick}
              aria-label="Explore my little world, scroll to creations"
            >
              <span>Explore my little world</span>
              <span aria-hidden="true">✦</span>
            </button>
            <button
              type="button"
              className="hero-btn hero-btn-secondary"
              onClick={handleMeetClick}
              aria-label="Meet Mallow, view character details"
            >
              Meet Mallow
            </button>
          </motion.div>

          {/* Small Handwritten Note — Delay: 0.6s */}
          <motion.div
            className="hero-handwritten-note"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span>every little story deserves a happy ending</span>
            <span className="hero-note-heart" aria-hidden="true">♡</span>
          </motion.div>
        </div>

        {/* Right Column: Mallow Character Illustration with Pointer Reaction & Floating Stars */}
        <div className="hero-image-col">
          <div
            ref={imageContainerRef}
            className="mallow-pointer-wrapper"
            style={{
              transform: `translate3d(${x * 8}px, ${y * 8}px, 0)`
            }}
          >
            <div className="mallow-float-wrapper">
              {/* Lantern Glow Pulse Effect */}
              <div className="mallow-lantern-glow" aria-hidden="true" />

              {/* 6 Independent Floating Stars */}
              <FloatingStars />

              {/* Interactive Character Image Container */}
              <div
                className={`mallow-image-frame ${isBouncing ? 'bounce-active' : ''}`}
                onClick={handleMallowClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMallowClick();
                  }
                }}
                aria-label="Mallow the dream collector. Click to play a chime!"
                title="Click me for a chime! ✦"
              >
                <img
                  src="/images/mallow-hero.jpg"
                  alt="Mallow, The Little Dream Collector floating with a glowing star lantern"
                  className="mallow-character-img"
                  onError={(e) => {
                    e.currentTarget.onerror = () => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = MALLOW_FALLBACK_SVG;
                    };
                    e.currentTarget.src = '/images/mallow-hero.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Scroll Down Cue at Bottom */}
      <ScrollCue />
    </section>
  );
}
