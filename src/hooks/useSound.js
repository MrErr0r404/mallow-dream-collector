import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'mallow-sound-muted';

const FREQUENCIES = {
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
  C6: 1046.50
};


export function useSound() {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const audioCtxRef = useRef(null);

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

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {
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

  
  const playTone = useCallback((freq, startTime, duration, peakGain = 0.12, type = 'sine') => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      const attackTime = 0.008;
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
    }
  }, [getAudioContext]);

  
  const playClick = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    playTone(800, now, 0.06, 0.1, 'sine');
  }, [isMuted, getAudioContext, playTone]);

  
  const playChime = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    playTone(FREQUENCIES.C5, now, 0.35, 0.15, 'sine');
    playTone(FREQUENCIES.E5, now + 0.12, 0.45, 0.15, 'sine');
  }, [isMuted, getAudioContext, playTone]);

  
  const playBell = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    playTone(1200, now, 0.9, 0.14, 'sine');
    playTone(2400, now, 0.4, 0.03, 'sine');
  }, [isMuted, getAudioContext, playTone]);

  
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
