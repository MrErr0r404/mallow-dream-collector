import { useContext, useState } from 'react';
import { character } from '../data/character';
import { SoundContext } from '../App';
import { motion } from 'motion/react';
import { Heart, Sparkles, Star, BookOpen, Home } from 'lucide-react';
import './CharacterSheet.css';

/**
 * Quadrant translation mapping for 2x2 expression sprite sheet.
 * Happy:     top-left     -> translate(0, 0)
 * Sleepy:    top-right    -> translate(-100%, 0) (container frame) / translate(-50%, 0) (element scale)
 * Curious:   bottom-left  -> translate(0, -100%) (container frame) / translate(0, -50%) (element scale)
 * Surprised: bottom-right -> translate(-100%, -100%) (container frame) / translate(-50%, -50%) (element scale)
 */
const QUADRANT_POSITIONS = {
  happy: {
    transform: 'translate(0, 0)',
    promptTransform: 'translate(0, 0)',
    objectPosition: '0% 0%',
    mouth: 'happy'
  },
  sleepy: {
    transform: 'translate(-50%, 0)',
    promptTransform: 'translate(-100%, 0)',
    objectPosition: '100% 0%',
    mouth: 'sleepy'
  },
  curious: {
    transform: 'translate(0, -50%)',
    promptTransform: 'translate(0, -100%)',
    objectPosition: '0% 100%',
    mouth: 'curious'
  },
  surprised: {
    transform: 'translate(-50%, -50%)',
    promptTransform: 'translate(-100%, -100%)',
    objectPosition: '100% 100%',
    mouth: 'surprised'
  }
};

export default function CharacterSheet() {
  const soundContext = useContext(SoundContext);
  const [activeExpression, setActiveExpression] = useState('happy');
  const [sparkleKey, setSparkleKey] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Safe expression list extractor supporting either object or array shapes
  const expressionsList = character?.expressions
    ? Object.entries(character.expressions).map(([key, data]) => ({
        id: key,
        label: data.label || key.charAt(0).toUpperCase() + key.slice(1),
        emoji: data.emoji || '✨',
        message: data.message || "Mallow smiles warmly at you!"
      }))
    : [
        { id: 'happy', label: 'Happy', emoji: '✨', message: "Oh! A happy visitor! Mallow's glow brightens!" },
        { id: 'sleepy', label: 'Sleepy', emoji: '💤', message: "Zzz... even dream collectors need rest sometimes..." },
        { id: 'curious', label: 'Curious', emoji: '❓', message: "Hmm? What's that? Mallow tilts to get a closer look!" },
        { id: 'surprised', label: 'Surprised', emoji: '⭐', message: "*achoo!* Oh! Tiny stars everywhere! Sorry about that!" }
      ];

  const currentExpr = expressionsList.find(e => e.id === activeExpression) || expressionsList[0];
  const quadrant = QUADRANT_POSITIONS[activeExpression] || QUADRANT_POSITIONS.happy;

  const handleSelectExpression = (id) => {
    if (id === activeExpression) return;
    setActiveExpression(id);
    setSparkleKey(prev => prev + 1);

    // Audio cue on expression change
    if (soundContext?.playClick) {
      soundContext.playClick();
    } else if (soundContext?.playStarPop) {
      soundContext.playStarPop();
    } else if (soundContext?.playBell) {
      soundContext.playBell();
    }
  };

  return (
    <section id="about" className="character-sheet-section" aria-label="Character Profile">
      <div className="character-sheet-container">
        
        {/* Section Header */}
        <motion.div 
          className="character-sheet-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="memory-badge">
            <Star className="memory-badge-icon" aria-hidden="true" />
            <span>✦ MEMORY NO. 001</span>
          </div>
          <h2 className="character-sheet-title">Meet Mallow</h2>
          <p className="character-sheet-subtitle">
            A tiny, gentle soul wandering through forgotten dreams with a star lantern in hand.
          </p>
        </motion.div>

        {/* Two-Column Scrapbook Layout */}
        <div className="scrapbook-layout">
          
          {/* =========================================================
              LEFT COLUMN: Character Card (Expression Display & Controls)
              ========================================================= */}
          <motion.div 
            className="character-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Scrapbook washi tape element */}
            <div className="washi-tape" aria-hidden="true" />

            {/* Specimen Profile Stamp */}
            <div className="stamp-badge">
              <Sparkles size={12} aria-hidden="true" />
              <span>CHARACTER PROFILE</span>
            </div>

            {/* Expression Frame with Sparkle Animations */}
            <div className="expression-viewport-container">
              {/* Animated Floating Sparkles upon Expression Change */}
              <motion.div 
                key={`sparkles-${sparkleKey}`}
                className="card-sparkles-wrap"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                aria-hidden="true"
              >
                <span className="sparkle-particle sparkle-p1">✨</span>
                <span className="sparkle-particle sparkle-p2">⭐</span>
                <span className="sparkle-particle sparkle-p3">✦</span>
                <span className="sparkle-particle sparkle-p4">✨</span>
              </motion.div>

              {/* Expression Image Container (2x2 Quadrant Crop) */}
              <motion.div 
                key={`img-${activeExpression}`}
                className="expression-image"
                initial={{ scale: 0.92, opacity: 0.85 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                {!imageError ? (
                  <img
                    src="/mallow-expressions.jpg"
                    alt={`Mallow with a ${currentExpr.label} expression`}
                    className="expression-img"
                    style={{
                      transform: quadrant.transform,
                      objectPosition: quadrant.objectPosition
                    }}
                    data-transform={quadrant.promptTransform}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.retried) {
                        e.currentTarget.dataset.retried = 'true';
                        e.currentTarget.src = '/mallow-expressions.svg';
                      } else {
                        setImageError(true);
                      }
                    }}
                  />
                ) : (
                  /* High quality SVG character representation fallback */
                  <div className="expression-fallback" role="img" aria-label={`Mallow looking ${currentExpr.label}`}>
                    <svg className="fallback-ghost-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="ghostGrad" cx="50%" cy="40%" r="55%">
                          <stop offset="0%" stopColor="#f3eeff" />
                          <stop offset="100%" stopColor="#c7b5f5" />
                        </radialGradient>
                      </defs>
                      {/* Ghost Body */}
                      <path 
                        d="M20 52 C20 30 34 16 50 16 C66 16 80 30 80 52 C80 72 78 82 72 82 C68 82 66 76 60 76 C54 76 52 82 46 82 C40 82 38 76 32 76 C26 76 24 82 20 82 C16 82 20 72 20 52 Z" 
                        fill="url(#ghostGrad)" 
                      />
                      {/* Rosy Cheeks */}
                      <ellipse cx="32" cy="54" rx="5" ry="3" fill="#f6dce8" />
                      <ellipse cx="68" cy="54" rx="5" ry="3" fill="#f6dce8" />
                      {/* Forehead Star */}
                      <polygon points="50,20 52,25 57,25 53,28 55,33 50,30 45,33 47,28 43,25 48,25" fill="#f4cc77" />
                      
                      {/* Dynamic Eyes & Mouth according to expression */}
                      {activeExpression === 'happy' && (
                        <g>
                          <path d="M33 46 Q38 41 43 46" stroke="#3d2145" strokeWidth="3" strokeLinecap="round" fill="none" />
                          <path d="M57 46 Q62 41 67 46" stroke="#3d2145" strokeWidth="3" strokeLinecap="round" fill="none" />
                          <path d="M47 54 Q50 58 53 54" stroke="#a34063" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </g>
                      )}
                      {activeExpression === 'sleepy' && (
                        <g>
                          <line x1="33" y1="46" x2="43" y2="46" stroke="#3d2145" strokeWidth="2.8" strokeLinecap="round" />
                          <line x1="57" y1="46" x2="67" y2="46" stroke="#3d2145" strokeWidth="2.8" strokeLinecap="round" />
                          <ellipse cx="50" cy="53" rx="2" ry="1.5" fill="#a34063" />
                          <text x="70" y="38" fill="#a34063" fontSize="11" fontWeight="bold" fontFamily="sans-serif">z</text>
                          <text x="76" y="28" fill="#a34063" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Z</text>
                        </g>
                      )}
                      {activeExpression === 'curious' && (
                        <g>
                          <ellipse cx="38" cy="45" rx="4" ry="4.5" fill="#3d2145" />
                          <circle cx="36.5" cy="43.5" r="1.3" fill="#ffffff" />
                          <ellipse cx="62" cy="44" rx="4.5" ry="5" fill="#3d2145" />
                          <circle cx="60.5" cy="42" r="1.5" fill="#ffffff" />
                          <circle cx="50" cy="54" r="2.2" fill="#a34063" />
                        </g>
                      )}
                      {activeExpression === 'surprised' && (
                        <g>
                          <ellipse cx="37" cy="45" rx="5" ry="5.5" fill="#3d2145" />
                          <circle cx="35.5" cy="43" r="1.6" fill="#ffffff" />
                          <ellipse cx="63" cy="45" rx="5" ry="5.5" fill="#3d2145" />
                          <circle cx="61.5" cy="43" r="1.6" fill="#ffffff" />
                          <ellipse cx="50" cy="55" rx="3.5" ry="4.5" fill="#a34063" />
                        </g>
                      )}
                    </svg>
                    <span className="fallback-label">{currentExpr.emoji} {currentExpr.label}</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Expression Message Card */}
            <motion.div 
              key={`msg-${activeExpression}`}
              className="expression-message-card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="expression-message-text">
                &ldquo;{currentExpr.message}&rdquo;
              </p>
            </motion.div>

            {/* Expression Selector Buttons (4 in a row) */}
            <div className="expression-selector" role="group" aria-label="Select Mallow's expression">
              {expressionsList.map((expr) => {
                const isActive = expr.id === activeExpression;
                return (
                  <button
                    key={expr.id}
                    type="button"
                    onClick={() => handleSelectExpression(expr.id)}
                    className={`expression-btn ${isActive ? 'active' : ''}`}
                    aria-pressed={isActive}
                    aria-label={`Show ${expr.label} expression`}
                  >
                    <span className="expression-btn-emoji" aria-hidden="true">{expr.emoji}</span>
                    <span className="expression-btn-label">{expr.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* =========================================================
              RIGHT COLUMN: Character Info (Profile, Quirks, Favorites)
              ========================================================= */}
          <div className="character-info-wrap">
            
            {/* Name & Title Block */}
            <motion.div 
              className="profile-title-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="washi-tape washi-tape-alt" aria-hidden="true" />
              <div className="profile-name-row">
                <h3 className="character-name">{character?.name || 'Mallow'}</h3>
                <span className="character-collector-tag">
                  <Sparkles size={13} aria-hidden="true" />
                  <span>DREAM SPIRIT</span>
                </span>
              </div>
              <p className="character-subtitle-text">{character?.title || 'The Little Dream Collector'}</p>
            </motion.div>

            {/* Info Grid: Species, Home, Job */}
            <motion.div 
              className="info-grid"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Species */}
              <div className="info-card">
                <div className="info-icon-bubble bubble-gold" aria-hidden="true">
                  <Star size={18} fill="currentColor" />
                </div>
                <div className="info-content">
                  <span className="info-label">Species</span>
                  <span className="info-value">{character?.species || 'Tiny Dream Ghost'}</span>
                </div>
              </div>

              {/* Home */}
              <div className="info-card">
                <div className="info-icon-bubble bubble-lavender" aria-hidden="true">
                  <Home size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Home</span>
                  <span className="info-value">{character?.home || 'The Forgotten Things Library'}</span>
                </div>
              </div>

              {/* Job */}
              <div className="info-card">
                <div className="info-icon-bubble bubble-berry" aria-hidden="true">
                  <BookOpen size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Job</span>
                  <span className="info-value">
                    {character?.occupation || character?.job || 'Dream Collector & Story Repairer'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Personality Tags */}
            <motion.div 
              className="scrapbook-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="scrapbook-card-header">
                <Heart className="card-header-icon" aria-hidden="true" />
                <h4 className="scrapbook-card-title">Personality Traits</h4>
              </div>
              <div className="personality-pill-wrap">
                {(character?.personality || ['Gentle', 'Curious', 'Shy at first', 'Endlessly kind']).map((trait, idx) => (
                  <span key={idx} className="personality-pill">
                    <span aria-hidden="true">✦</span> {trait}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Quirks Section */}
            <motion.div 
              className="scrapbook-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="scrapbook-card-header">
                <Sparkles className="card-header-icon" aria-hidden="true" />
                <h4 className="scrapbook-card-title">Little Quirks</h4>
              </div>
              <div className="quirks-container">
                <ul className="quirks-list">
                  {(character?.quirks || [
                    'Floats upside down when thinking',
                    'Sneezes tiny stars when surprised',
                    'Becomes brighter when visitors interact'
                  ]).map((quirk, idx) => (
                    <li key={idx} className="quirk-item">{quirk}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Favorites Section */}
            <motion.div 
              className="scrapbook-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <div className="scrapbook-card-header">
                <Star className="card-header-icon" aria-hidden="true" />
                <h4 className="scrapbook-card-title">Favorite Things</h4>
              </div>
              <div className="favorites-tag-cloud">
                {(character?.favorites || [
                  'Forgotten lullabies',
                  'Warm starlight',
                  'Unfinished stories',
                  'The smell of old books',
                  'Tiny paper cranes'
                ]).map((fav, idx) => (
                  <span key={idx} className="favorite-tag">
                    <Star className="favorite-tag-icon" fill="currentColor" aria-hidden="true" />
                    <span>{fav}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Abilities Section */}
            <motion.div 
              className="scrapbook-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="scrapbook-card-header">
                <BookOpen className="card-header-icon" aria-hidden="true" />
                <h4 className="scrapbook-card-title">Special Abilities</h4>
              </div>
              <ul className="abilities-list">
                {(character?.abilities || [
                  'Collecting forgotten dreams',
                  'Repairing story endings',
                  'Preserving happy memories',
                  'Making lost things glow again'
                ]).map((ability, idx) => (
                  <li key={idx} className="ability-item">
                    <Star className="ability-star-icon" aria-hidden="true" />
                    <span>{ability}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>

        {/* Decorative Scrapbook Footer Divider */}
        <div className="scrapbook-footer-decor" aria-hidden="true">
          <div className="footer-decor-line" />
          <span>✦ END OF SPECIMEN MEMORY ✦</span>
          <div className="footer-decor-line" />
        </div>

      </div>
    </section>
  );
}
