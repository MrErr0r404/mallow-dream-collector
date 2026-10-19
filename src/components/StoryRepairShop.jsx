import React, { useState, useContext } from 'react';
import { SoundContext } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, RotateCcw, Check, Sparkles, Feather } from 'lucide-react';
import './StoryRepairShop.css';

const STORY_DATA = {
  chapter: 'Chapter I',
  subtitle: 'The Origami Crane',
  unfinishedText:
    "Once upon a time, a little paper crane sat on a windowsill, watching the rain. It had been folded by someone who had since forgotten about it. Every night, it dreamed of flying, but paper cranes aren't meant to fly... or are they?",
  endings: [
    {
      id: 'wind',
      title: "The Wind's Gift",
      tagline: 'Freedom & Flight',
      icon: '🍃',
      text: 'A gentle breeze lifted the crane from the windowsill. It soared above the rooftops, dancing with real birds, finally free.',
      illustration: 'flying',
    },
    {
      id: 'maker',
      title: 'The Maker Returns',
      tagline: 'Reunion & Care',
      icon: '🌸',
      text: 'One rainy morning, the person who folded the crane returned. They smiled, picked it up, and placed it in a garden of a thousand paper flowers.',
      illustration: 'garden',
    },
    {
      id: 'star',
      title: 'The Star Friend',
      tagline: 'Friendship & Wonder',
      icon: '⭐',
      text: 'That night, a tiny fallen star landed on the windowsill. The crane and the star became friends, sharing stories until dawn painted the sky.',
      illustration: 'starry',
    },
  ],
};

export default function StoryRepairShop() {
  const soundContext = useContext(SoundContext);
  const [selectedEndingId, setSelectedEndingId] = useState(null);
  const [isRepairing, setIsRepairing] = useState(false);

  const selectedEnding = STORY_DATA.endings.find((e) => e.id === selectedEndingId);

  const handleSelectEnding = (ending) => {
    if (selectedEndingId === ending.id) return;

    setIsRepairing(true);
    setSelectedEndingId(ending.id);

    try {
      soundContext?.playChime?.();
    } catch {
    }

    setTimeout(() => {
      setIsRepairing(false);
    }, 400);
  };

  const handleReset = () => {
    try {
      soundContext?.playClick?.();
    } catch {
    }
    setSelectedEndingId(null);
  };

  return (
    <section className="story-shop-section" id="story-repair">
      <div className="story-shop-container">
        {}
        <div className="story-shop-header">
          <span className="story-shop-badge">✦ CREATION NO. 001</span>
          <h2 className="story-shop-title">The Story Repair Shop</h2>
          <p className="story-shop-description">
            Mallow finds unfinished stories and gives them satisfying endings. Choose how this little tale ends!
          </p>
        </div>

        {}
        <div className="story-book-wrapper">
          <div className="story-book-spine"></div>
          <article className="story-book-page">
            {}
            <div className="book-ribbon" aria-hidden="true">
              <span className="ribbon-star">★</span>
            </div>

            {}
            <div className="corner-filigree top-left" aria-hidden="true">❦</div>
            <div className="corner-filigree top-right" aria-hidden="true">❦</div>
            <div className="corner-filigree bottom-left" aria-hidden="true">❦</div>
            <div className="corner-filigree bottom-right" aria-hidden="true">❦</div>

            {}
            <div className="book-page-header">
              <div className="book-page-meta">
                <span className="book-chapter">
                  <BookOpen size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                  {STORY_DATA.chapter}
                </span>
                <span className="book-meta-divider">✦</span>
                <span className="book-tale-title">{STORY_DATA.subtitle}</span>
              </div>
              <div className="book-page-number">Page 42</div>
            </div>

            {}
            <div className={`crane-illustration-container ${selectedEnding ? `state-${selectedEnding.illustration}` : ''}`}>
              <svg
                viewBox="0 0 160 110"
                className="crane-svg"
                aria-label="Origami paper crane illustration"
                role="img"
              >
                <defs>
                  <linearGradient id="craneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff8f1" />
                    <stop offset="50%" stopColor="#f6dce8" />
                    <stop offset="100%" stopColor="#c7b5f5" />
                  </linearGradient>
                  <linearGradient id="craneShade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a34063" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#5c4033" stopOpacity="0.25" />
                  </linearGradient>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {}
                {selectedEndingId === 'star' && (
                  <g className="floating-stars">
                    <circle cx="25" cy="20" r="3" fill="#f4cc77" filter="url(#softGlow)" />
                    <polygon points="135,25 137,30 142,31 138,34 139,39 135,36 131,39 132,34 128,31 133,30" fill="#f4cc77" />
                    <polygon points="80,12 82,16 86,17 83,19 84,23 80,21 76,23 77,19 74,17 78,16" fill="#f4cc77" />
                  </g>
                )}

                {}
                {selectedEndingId === 'maker' && (
                  <g className="garden-flowers">
                    <circle cx="20" cy="85" r="5" fill="#f6dce8" />
                    <circle cx="32" cy="88" r="4" fill="#f4cc77" />
                    <circle cx="130" cy="85" r="5" fill="#f6dce8" />
                    <circle cx="142" cy="88" r="4" fill="#c7b5f5" />
                  </g>
                )}

                {}
                {selectedEndingId === 'wind' && (
                  <g className="wind-breeze" stroke="#c7b5f5" strokeWidth="1.5" fill="none" strokeLinecap="round">
                    <path d="M 15 35 Q 45 25 75 35 T 145 25" strokeDasharray="3 3" opacity="0.7" />
                    <path d="M 30 75 Q 60 65 95 75 T 150 65" strokeDasharray="4 4" opacity="0.6" />
                  </g>
                )}

                {}
                <g className="origami-crane-body" transform="translate(40, 15)">
                  {}
                  <polygon points="40,35 0,10 30,50" fill="url(#craneGrad)" stroke="#5c4033" strokeWidth="1" />
                  {}
                  <polygon points="40,35 80,5 50,50" fill="url(#craneGrad)" stroke="#5c4033" strokeWidth="1" />
                  {}
                  <polygon points="30,50 10,68 35,55" fill="#eee7ff" stroke="#5c4033" strokeWidth="1" />
                  {}
                  <polygon points="30,50 40,25 50,50 40,65" fill="#fff8f1" stroke="#5c4033" strokeWidth="1.2" />
                  {}
                  <polygon points="45,50 65,30 75,32 50,55" fill="url(#craneGrad)" stroke="#5c4033" strokeWidth="1" />
                  <polygon points="70,30 78,32 72,36" fill="#f4cc77" stroke="#5c4033" strokeWidth="0.8" />
                  {}
                  <polygon points="40,25 50,50 40,65" fill="url(#craneShade)" />
                </g>

                {}
                <line x1="10" y1="92" x2="150" y2="92" stroke="#5c4033" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                <rect x="15" y="94" width="130" height="4" fill="#a34063" opacity="0.15" rx="2" />
              </svg>
            </div>

            {}
            <div className="story-content">
              <p className="story-text story-unfinished">
                <span className="drop-cap">O</span>
                nce upon a time, a little paper crane sat on a windowsill, watching the rain. It had been folded by someone who had since forgotten about it. Every night, it dreamed of flying, but paper cranes aren&apos;t meant to fly... or are they?
              </p>

              {}
              <AnimatePresence mode="wait">
                {selectedEnding && (
                  <motion.div
                    key={selectedEnding.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="story-repaired-block"
                  >
                    <div className="story-repaired-divider">
                      <span className="divider-line"></span>
                      <span className="divider-icon">{selectedEnding.icon}</span>
                      <span className="divider-line"></span>
                    </div>

                    <p className="story-text story-ending-text">
                      <strong className="story-ending-title">{selectedEnding.title}: </strong>
                      {selectedEnding.text}
                    </p>

                    {}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="story-completion-banner"
                    >
                      <div className="completion-badge">
                        <Check size={16} className="check-icon" />
                        <span>Another story repaired! ✦ Mallow is happy.</span>
                      </div>
                      <button
                        onClick={handleReset}
                        className="story-reset-btn"
                        type="button"
                        title="Read again and choose another ending"
                      >
                        <RotateCcw size={14} />
                        <span>Read Again</span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {}
            <div className="book-page-footer">
              <span className="footer-flourish">❦ ✦ ❦</span>
            </div>
          </article>
        </div>

        {}
        <div className="endings-selection-area">
          <div className="endings-title-row">
            <h3 className="endings-heading">
              <Feather size={18} className="endings-heading-icon" />
              <span>Choose an ending to repair the tale:</span>
            </h3>
            {selectedEnding && (
              <span className="active-ending-tag">
                Selected: <strong>{selectedEnding.title}</strong>
              </span>
            )}
          </div>

          <div className="endings-grid" role="group" aria-label="Story Endings">
            {STORY_DATA.endings.map((ending, index) => {
              const isSelected = selectedEndingId === ending.id;
              const isDimmed = selectedEndingId !== null && !isSelected;

              return (
                <motion.button
                  key={ending.id}
                  type="button"
                  onClick={() => handleSelectEnding(ending)}
                  className={`ending-card ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
                  whileHover={{ scale: isDimmed ? 0.98 : 1.02, translateY: isDimmed ? 0 : -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  aria-pressed={isSelected}
                >
                  <div className="ending-card-top">
                    <span className="ending-number">Option 0{index + 1}</span>
                    <span className="ending-icon" aria-hidden="true">{ending.icon}</span>
                  </div>

                  <h4 className="ending-title">{ending.title}</h4>
                  <span className="ending-tagline">{ending.tagline}</span>
                  <p className="ending-preview">{ending.text}</p>

                  <div className="ending-card-footer">
                    {isSelected ? (
                      <span className="status-selected">
                        <Check size={14} /> Repaired with this ending
                      </span>
                    ) : (
                      <span className="status-action">
                        <Sparkles size={14} /> Select this ending
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
