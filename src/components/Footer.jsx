import React, { useState } from 'react';
import VisitorCounter from './VisitorCounter';
import { Heart, ArrowUp, Star, Github } from 'lucide-react';
import './Footer.css';

export default function Footer({ onEasterEgg, onOpenSecret }) {
  const [starClicks, setStarClicks] = useState(0);

  const triggerEasterEgg = () => {
    if (typeof onOpenSecret === 'function') {
      onOpenSecret();
    } else if (typeof onEasterEgg === 'function') {
      onEasterEgg();
    }
  };

  const handleStarClick = () => {
    const nextCount = starClicks + 1;
    if (nextCount >= 5) {
      setStarClicks(0);
      triggerEasterEgg();
    } else {
      setStarClicks(nextCount);
    }
  };

  const handleStarKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStarClick();
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer-section">
      {/* Decorative dotted border on top */}
      <div className="footer-dotted-divider" aria-hidden="true" />

      <div className="footer-container">
        {/* Warm closing message from Mallow */}
        <div className="footer-mallow-message-box">
          <div className="footer-avatar" aria-hidden="true">
            🎐
          </div>
          <blockquote className="footer-mallow-quote">
            “Thank you for visiting my little corner of the internet. Every dreamer who stops by makes my library a little brighter. Sweet dreams, little one. ✦”
          </blockquote>
          <div className="footer-mallow-signature">
            — Mallow, The Little Dream Collector
          </div>
        </div>

        {/* Navigation links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <button
            type="button"
            className="footer-nav-link"
            onClick={() => scrollToSection('about')}
          >
            About
          </button>
          <button
            type="button"
            className="footer-nav-link"
            onClick={() => scrollToSection('creations')}
          >
            Creations
          </button>
          <button
            type="button"
            className="footer-nav-link"
            onClick={() => scrollToSection('story')}
          >
            Story
          </button>
          <button
            type="button"
            className="footer-nav-link"
            onClick={() => scrollToSection('memories')}
          >
            Memories
          </button>
        </nav>

        {/* Visitor Counter */}
        <div className="footer-counter-block">
          <VisitorCounter />
        </div>

        {/* Easter Egg Trigger Star */}
        <div className="footer-easter-egg-wrapper">
          <button
            type="button"
            className="easter-egg-star-btn"
            onClick={handleStarClick}
            onKeyDown={handleStarKeyDown}
            aria-label="A mysterious little star"
            title="A mysterious little star..."
          >
            <Star
              size={18}
              fill={starClicks > 0 ? '#f4cc77' : 'none'}
              strokeWidth={starClicks > 0 ? 0 : 2}
            />
          </button>
          {starClicks > 0 && (
            <span className="easter-egg-hint">
              {starClicks === 4 ? 'Almost there! ✨' : 'Twinkle...'}
            </span>
          )}
        </div>

        {/* Back to top */}
        <button
          type="button"
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top of page"
        >
          <ArrowUp size={16} aria-hidden="true" />
          <span>Back to top</span>
        </button>

        {/* Credits section */}
        <div className="footer-credits">
          <div className="credits-highlight">
            <span>Made with</span>
            <Heart size={16} className="credits-heart-icon" aria-hidden="true" />
            <span>for haX.baby 2026</span>
          </div>
          <div className="credits-list">
            <div>Character & artwork: Original creation</div>
            <div>Fonts: Fredoka, DM Serif Display, Inter via Google Fonts</div>
            <div>Icons: Lucide React</div>
            <div>Animations: Motion</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
