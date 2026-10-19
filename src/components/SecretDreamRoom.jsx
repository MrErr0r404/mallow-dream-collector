import React, { useEffect, useCallback, useContext, useRef } from 'react';
import { SoundContext } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import useReducedMotion from '../hooks/useReducedMotion';
import './SecretDreamRoom.css';

export default function SecretDreamRoom({ isOpen, onClose }) {
  const soundContext = useContext(SoundContext);
  const prefersReducedMotion = useReducedMotion();
  const returnButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const hasFiredConfettiRef = useRef(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = [closeButtonRef.current, returnButtonRef.current].filter(Boolean);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);

      if (soundContext?.playMusicBox) {
        soundContext.playMusicBox();
      }

      if (!hasFiredConfettiRef.current && !prefersReducedMotion) {
        hasFiredConfettiRef.current = true;
        try {
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 100,
              spread: 70,
              colors: ['#f4cc77', '#c7b5f5', '#f6dce8', '#eee7ff'],
              origin: { y: 0.6 }
            });
          }
        } catch (e) {
          console.warn('Confetti animation skipped:', e);
        }
      }

      const timer = setTimeout(() => {
        returnButtonRef.current?.focus();
      }, 50);

      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    } else {
      hasFiredConfettiRef.current = false;
    }
  }, [isOpen, handleKeyDown, prefersReducedMotion, soundContext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="secret-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="secret-room-title"
          onClick={onClose}
        >
          {}
          <div className="secret-stars-layer" aria-hidden="true">
            <span className="secret-bg-star">✦</span>
            <span className="secret-bg-star">✧</span>
            <span className="secret-bg-star">★</span>
            <span className="secret-bg-star">✦</span>
            <span className="secret-bg-star">✧</span>
            <span className="secret-bg-star">★</span>
          </div>

          <motion.div
            className="secret-modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          >
            {}
            <button
              ref={closeButtonRef}
              type="button"
              className="secret-close-icon-btn"
              onClick={onClose}
              aria-label="Close secret dream room"
            >
              <X size={18} />
            </button>

            {}
            <div className="secret-mallow-face" aria-label="Mallow smiling joyfully">
              (⁀ᗢ⁀)
            </div>

            {}
            <div className="secret-star-art" aria-hidden="true">
              <div className="secret-star-glow"></div>
              <span className="secret-star-icon">⭐</span>
            </div>

            {}
            <h2 id="secret-room-title" className="secret-title">
              ✦ You found the Secret Dream Room! ✦
            </h2>

            <p className="secret-message">
              Only the most curious dreamers find this place. Mallow has a gift for you...
            </p>

            {}
            <div className="secret-collectible-badge">
              <Star size={20} color="#f4cc77" fill="#f4cc77" />
              <span className="secret-badge-text">
                You received: The Golden Dream Star ⭐
              </span>
            </div>

            {}
            <button
              ref={returnButtonRef}
              type="button"
              className="secret-return-btn"
              onClick={onClose}
            >
              <span>Return to Mallow's World</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
