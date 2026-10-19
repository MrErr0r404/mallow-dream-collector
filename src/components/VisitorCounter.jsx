import React, { useState, useEffect, useRef } from 'react';
import './VisitorCounter.css';

const STORAGE_KEY = 'mallow-visit-count';
const BASE_COUNT = 1042; // Starting baseline number for realistic charm

export default function VisitorCounter() {
  const [displayedDigits, setDisplayedDigits] = useState(['0', '0', '0', '0', '0', '0']);
  const hasIncrementedRef = useRef(false);

  useEffect(() => {
    if (hasIncrementedRef.current) return;
    hasIncrementedRef.current = true;

    let currentCount = BASE_COUNT;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) {
          currentCount = parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read visitor count:', e);
    }

    const nextCount = currentCount + 1;

    try {
      localStorage.setItem(STORAGE_KEY, nextCount.toString());
    } catch (e) {
      console.warn('Could not write visitor count:', e);
    }

    const formattedDigits = nextCount.toString().padStart(6, '0').split('');

    const timer = setTimeout(() => {
      setDisplayedDigits(formattedDigits);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="visitor-counter-wrapper" role="region" aria-label="Visitor counter">
      <div className="counter-header">
        <span className="counter-led-dot" aria-hidden="true"></span>
        <span className="counter-label">DREAMERS WHO VISITED</span>
      </div>

      <div
        className="odometer-display"
        role="img"
        aria-label={`Total dreamers visited: ${displayedDigits.join('')}`}
      >
        {displayedDigits.map((digitChar, index) => {
          const numValue = parseInt(digitChar, 10) || 0;
          return (
            <div key={index} className="odometer-digit-box">
              <div
                className="odometer-digit-strip"
                style={{
                  transform: `translateY(-${numValue * 10}%)`,
                  transitionDelay: `${index * 90}ms`
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <div key={n} className="odometer-number" aria-hidden={n !== numValue}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="counter-footer">
        <span className="counter-sublabel">(local demo counter)</span>
      </div>
    </div>
  );
}
