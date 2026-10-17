import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'mallow-sound-muted';

// Musical note frequencies in Hz
const FREQUENCIES = {
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
  C6: 1046.50
};

/**
 * useSound Hook
 * Synthesizes whimsical chimes, bells, and clicks using the Web Audio API.
 * Starts muted by default and remembers user preference.
 */
export function useSound() {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Global muted state starts muted by default unless previously explicitly unmuted
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const audioCtxRef = useRef(null);

  // Lazy initialization of Web Audio context
  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContextClass();
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    return audioCtxRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {
          // Ignored
        }
      }
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch (e) {
        console.warn('Could not save sound preference to localStorage:', e);
      }
      return next;
    });
  }, []);

  /**
   * Helper to play a single synthesized tone with an exponential decay
   */
  const playTone = useCallback((freq, startTime, duration, peakGain = 0.12, type = 'sine') => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Attack and gentle exponential decay
      const attackTime = 0.008;
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio autoplay policy or failure guard
    }
  }, [getAudioContext]);

  /**
   * playClick: Short 800Hz sine wave with quick decay
   */
  const playClick = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    playTone(800, now, 0.06, 0.1, 'sine');
  }, [isMuted, getAudioContext, playTone]);

  /**
   * playChime: 2-note sequence (C5, E5) with gentle decay
   */
  const playChime = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    playTone(FREQUENCIES.C5, now, 0.35, 0.15, 'sine');
    playTone(FREQUENCIES.E5, now + 0.12, 0.45, 0.15, 'sine');
  }, [isMuted, getAudioContext, playTone]);

  /**
   * playBell: Soft bell at 1200Hz with longer sustain
   */
  const playBell = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Fundamental tone
    playTone(1200, now, 0.9, 0.14, 'sine');
    // Soft high harmonic for bell warmth
    playTone(2400, now, 0.4, 0.03, 'sine');
  }, [isMuted, getAudioContext, playTone]);

  /**
   * playMusicBox: 4-note melody (C5, E5, G5, C6) with delays
   */
  const playMusicBox = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: FREQUENCIES.C5, delay: 0.00 },
      { freq: FREQUENCIES.E5, delay: 0.14 },
      { freq: FREQUENCIES.G5, delay: 0.28 },
      { freq: FREQUENCIES.C6, delay: 0.42 }
    ];

    notes.forEach(({ freq, delay }) => {
      playTone(freq, now + delay, 0.38, 0.12, 'triangle');
    });
  }, [isMuted, getAudioContext, playTone]);

  /**
   * playStarPop: Cheerful high-frequency pop (1400Hz) with rapid exponential decay
   */
  const playStarPop = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    playTone(1400, now, 0.08, 0.12, 'sine');
  }, [isMuted, getAudioContext, playTone]);

  return useMemo(() => ({
    isMuted,
    toggleMute,
    playClick,
    playChime,
    playBell,
    playMusicBox,
    playStarPop
  }), [
    isMuted,
    toggleMute,
    playClick,
    playChime,
    playBell,
    playMusicBox,
    playStarPop
  ]);
}

export default useSound;
