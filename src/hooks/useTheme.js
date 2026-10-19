import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mallow-theme';


export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'day';
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme === 'night' || savedTheme === 'day') {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'night';
      }
    } catch {
    }
    return 'day';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      console.warn('Could not save theme to localStorage:', err);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e) => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          setTheme(e.matches ? 'night' : 'day');
        }
      } catch {
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
      return () => mediaQuery.removeListener(handleSystemChange);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'night' ? 'day' : 'night'));
  }, []);

  const isDark = theme === 'night';

  return { theme, toggleTheme, isDark, setTheme };
}

export default useTheme;
