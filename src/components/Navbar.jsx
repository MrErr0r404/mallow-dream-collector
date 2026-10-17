import React, { useContext, useState, useEffect } from 'react';
import { Sun, Moon, Volume2, VolumeX, Sparkles, Menu, X } from 'lucide-react';
import { SoundContext, ThemeContext } from '../App';

export default function Navbar({
  chaosMode = false,
  setChaosMode,
  onToggleChaos,
  onOpenSecret
}) {
  const themeContext = useContext(ThemeContext) || {};
  const soundContext = useContext(SoundContext) || {};

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Determine current theme state
  const isNight =
    themeContext.theme === 'night' ||
    themeContext.isNight === true ||
    (typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'night');

  // Determine muted state
  const isMuted =
    soundContext.isMuted ??
    (soundContext.soundEnabled !== undefined ? !soundContext.soundEnabled : false);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'creations', label: 'Creations' },
    { id: 'story', label: 'Story' },
    { id: 'memories', label: 'Memories' }
  ];

  // Active section observer
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'creations', 'story', 'memories'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
    if (soundContext.playStarPop) {
      soundContext.playStarPop();
    }
  };

  const handleThemeToggle = () => {
    if (themeContext.toggleTheme) {
      themeContext.toggleTheme();
    } else {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'night' ? 'day' : 'night';
      document.documentElement.setAttribute('data-theme', nextTheme);
      try {
        localStorage.setItem('mallow-theme', nextTheme);
      } catch (err) {}
    }
    if (soundContext.playMusicBox) {
      soundContext.playMusicBox();
    }
  };

  const handleSoundToggle = () => {
    if (soundContext.toggleMute) {
      soundContext.toggleMute();
    } else if (soundContext.toggleSound) {
      soundContext.toggleSound();
    }
  };

  const handleChaosToggle = () => {
    if (typeof onToggleChaos === 'function') {
      onToggleChaos();
    } else if (setChaosMode) {
      setChaosMode(!chaosMode);
    }
    if (soundContext.playChime) {
      soundContext.playChime();
    }
  };

  return (
    <>
      <style>{`
        :root {
          --nav-height: 72px;
          --bg-nav: rgba(255, 248, 241, 0.88);
          --border-color: rgba(163, 64, 99, 0.14);
          --text-primary: #5c4033;
          --text-secondary: #8c6b5d;
          --accent-berry: #a34063;
          --warm-gold: #f4cc77;
          --pale-lilac: #eee7ff;
          --lavender: #c7b5f5;
        }

        [data-theme='night'] {
          --bg-nav: rgba(33, 29, 58, 0.88);
          --border-color: rgba(199, 181, 245, 0.18);
          --text-primary: #fff8f1;
          --text-secondary: #c7b5f5;
          --accent-berry: #f4cc77;
        }

        .mallow-navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          background: var(--bg-nav);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 20px -8px rgba(33, 29, 58, 0.08);
        }

        .navbar-container {
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          color: var(--text-primary);
          cursor: pointer;
          border-radius: 999px;
          padding: 0.35rem 0.6rem;
          margin-left: -0.6rem;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .navbar-brand:hover {
          transform: scale(1.04);
        }

        .navbar-brand:focus-visible {
          outline: 2px solid var(--accent-berry);
          outline-offset: 3px;
        }

        .brand-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 2px 6px rgba(199, 181, 245, 0.45));
          animation: floatSmall 3.5s ease-in-out infinite;
        }

        @keyframes floatSmall {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .brand-wordmark {
          font-family: 'Fredoka', cursive, sans-serif;
          font-size: 1.45rem;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .brand-sparkle-dot {
          color: var(--warm-gold);
          font-size: 1rem;
          line-height: 1;
          animation: spinSlow 8s linear infinite;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .navbar-nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item-link {
          font-family: 'Fredoka', cursive, sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item-link:hover {
          color: var(--text-primary);
          background: rgba(199, 181, 245, 0.18);
        }

        .nav-item-link.active {
          color: var(--accent-berry);
          font-weight: 600;
          background: rgba(199, 181, 245, 0.26);
        }

        .nav-item-link:focus-visible {
          outline: 2px solid var(--accent-berry);
          outline-offset: 2px;
        }

        .navbar-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .control-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.45);
          color: var(--text-primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        [data-theme='night'] .control-btn {
          background: rgba(255, 255, 255, 0.08);
        }

        .control-btn:hover {
          transform: translateY(-2px) scale(1.05);
          background: var(--pale-lilac);
          color: var(--accent-berry);
          border-color: var(--lavender);
        }

        .control-btn:active {
          transform: translateY(0) scale(0.96);
        }

        .control-btn:focus-visible {
          outline: 2px solid var(--accent-berry);
          outline-offset: 2px;
        }

        .control-btn.chaos-btn.chaos-active {
          background: #f4cc77;
          color: #211d3a;
          border-color: #f4cc77;
          animation: chaosPulse 1.8s infinite;
          box-shadow: 0 0 16px rgba(244, 204, 119, 0.7);
        }

        @keyframes chaosPulse {
          0%, 100% { box-shadow: 0 0 14px rgba(244, 204, 119, 0.7); transform: scale(1); }
          50% { box-shadow: 0 0 22px rgba(244, 204, 119, 0.95); transform: scale(1.08) rotate(4deg); }
        }

        .hamburger-btn {
          display: none;
        }

        .mobile-dropdown-menu {
          display: none;
        }

        @media (max-width: 768px) {
          .navbar-nav-links {
            display: none;
          }

          .hamburger-btn {
            display: inline-flex;
          }

          .mobile-dropdown-menu {
            display: block;
            position: absolute;
            top: var(--nav-height);
            left: 0;
            right: 0;
            background: var(--bg-nav);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom: 1px solid var(--border-color);
            padding: 1.25rem 1.5rem;
            transform: translateY(-120%);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
            box-shadow: 0 16px 30px rgba(33, 29, 58, 0.15);
          }

          .mobile-dropdown-menu.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .mobile-nav-links {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.65rem;
          }

          .mobile-nav-item {
            font-family: 'Fredoka', cursive, sans-serif;
            font-size: 1.15rem;
            font-weight: 500;
            color: var(--text-primary);
            text-decoration: none;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: background 0.2s ease, color 0.2s ease;
          }

          .mobile-nav-item:hover,
          .mobile-nav-item.active {
            background: rgba(199, 181, 245, 0.24);
            color: var(--accent-berry);
            font-weight: 600;
          }
        }
      `}</style>

      <header className="mallow-navbar" role="banner">
        <div className="navbar-container">
          {/* Left: Brand Logo & Wordmark */}
          <a
            href="#hero"
            className="navbar-brand"
            onClick={(e) => handleNavClick(e, 'hero')}
            aria-label="Mallow, The Little Dream Collector — Back to Top"
          >
            <div className="brand-icon-wrapper">
              {/* Simplified Mallow Face SVG (< 30 lines) */}
              <svg
                viewBox="0 0 36 36"
                width="34"
                height="34"
                aria-hidden="true"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <radialGradient id="mallowNavGrad" cx="45%" cy="35%" r="55%">
                    <stop offset="0%" stopColor="#f3edff" />
                    <stop offset="65%" stopColor="#c7b5f5" />
                    <stop offset="100%" stopColor="#ab94eb" />
                  </radialGradient>
                </defs>
                <ellipse cx="18" cy="18" rx="14" ry="15" fill="url(#mallowNavGrad)" />
                <path
                  d="M5 23 Q9 32 13 28 Q18 34 23 28 Q27 32 31 23 Z"
                  fill="url(#mallowNavGrad)"
                />
                <ellipse cx="13" cy="17" rx="2.4" ry="3" fill="#211d3a" />
                <ellipse cx="23" cy="17" rx="2.4" ry="3" fill="#211d3a" />
                <circle cx="12" cy="15.5" r="0.8" fill="#f4cc77" />
                <circle cx="22" cy="15.5" r="0.8" fill="#f4cc77" />
                <ellipse cx="9" cy="21" rx="2.2" ry="1.2" fill="#f6dce8" opacity="0.8" />
                <ellipse cx="27" cy="21" rx="2.2" ry="1.2" fill="#f6dce8" opacity="0.8" />
                <polygon
                  points="18,4.5 19.5,9 24,9.5 20.2,12.6 21.6,17 18,14.2 14.4,17 15.8,12.6 12,9.5 16.5,9"
                  fill="#f4cc77"
                />
              </svg>
            </div>
            <span className="brand-wordmark">
              Mallow
              <span className="brand-sparkle-dot">✦</span>
            </span>
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="navbar-navigation" aria-label="Main Navigation">
            <ul className="navbar-nav-links">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`nav-item-link ${activeSection === link.id ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Controls & Mobile Hamburger */}
          <div className="navbar-controls">
            {/* Chaos Mode Toggle */}
            <button
              type="button"
              className={`control-btn chaos-btn ${chaosMode ? 'chaos-active' : ''}`}
              onClick={handleChaosToggle}
              aria-label={chaosMode ? 'Turn off Chaos Mode' : 'Turn on Chaos Mode'}
              title={chaosMode ? 'Chaos Mode is ON! (Sparkles galore)' : 'Unleash Chaos Mode!'}
            >
              <Sparkles size={18} />
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              className="control-btn sound-btn"
              onClick={handleSoundToggle}
              aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              title={isMuted ? 'Play magical sounds' : 'Mute sounds'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              className="control-btn theme-btn"
              onClick={handleThemeToggle}
              aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}
              title={isNight ? 'Wake up to morning glow' : 'Drift into starlit night'}
            >
              {isNight ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="control-btn hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`mobile-dropdown-menu ${mobileMenuOpen ? 'open' : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`mobile-nav-item ${activeSection === link.id ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                >
                  <span>{link.label}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--warm-gold)' }}>✦</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
}
