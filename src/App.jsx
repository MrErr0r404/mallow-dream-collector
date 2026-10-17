import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useSound } from './hooks/useSound';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CharacterSheet from './components/CharacterSheet';
import StoryRepairShop from './components/StoryRepairShop';
import MemoryLantern from './components/MemoryLantern';
import DreamRoute from './components/DreamRoute';
import StoryTimeline from './components/StoryTimeline';
import MemoryCollection from './components/MemoryCollection';
import SparkleTrail from './components/SparkleTrail';
import SecretDreamRoom from './components/SecretDreamRoom';
import Footer from './components/Footer';

// Context Exports
export const ThemeContext = createContext(null);
export const SoundContext = createContext(null);

export const useThemeContext = () => useContext(ThemeContext);
export const useSoundContext = () => useContext(SoundContext);

export function App() {
  const themeState = useTheme();
  const soundState = useSound();

  const [chaosMode, setChaosMode] = useState(false);
  const [isSecretRoomOpen, setIsSecretRoomOpen] = useState(false);

  const toggleChaosMode = useCallback(() => {
    setChaosMode((prev) => !prev);
    soundState.playBell();
  }, [soundState]);

  const openSecretRoom = useCallback(() => {
    setIsSecretRoomOpen(true);
    soundState.playMusicBox();
  }, [soundState]);

  const closeSecretRoom = useCallback(() => {
    setIsSecretRoomOpen(false);
    soundState.playClick();
  }, [soundState]);

  const openSecretRoomRef = useRef(openSecretRoom);
  openSecretRoomRef.current = openSecretRoom;
  const keyBufferRef = useRef('');

  // Easter egg: Listen for "mallow", "dream", or "star" secret typed sequence
  useEffect(() => {
    const secretKeywords = ['mallow', 'dream', 'star'];

    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      // Only single character printable keys
      if (e.key.length !== 1) return;

      keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-10);

      if (secretKeywords.some((word) => keyBufferRef.current.endsWith(word))) {
        openSecretRoomRef.current();
        keyBufferRef.current = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const themeContextValue = {
    ...themeState,
    chaosMode,
    toggleChaosMode,
    setChaosMode,
    isSecretRoomOpen,
    openSecretRoom,
    closeSecretRoom
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <SoundContext.Provider value={soundState}>
        <div
          className={`mallow-app ${chaosMode ? 'chaos-mode' : ''}`}
          data-theme={themeState.theme}
          data-chaos={chaosMode ? 'true' : 'false'}
          style={{
            minHeight: '100vh',
            position: 'relative',
            overflowX: 'hidden'
          }}
        >
          {/* Mouse sparkle trail effect */}
          <SparkleTrail chaosMode={chaosMode} />

          {/* Navigation Bar */}
          <Navbar
            onOpenSecret={openSecretRoom}
            chaosMode={chaosMode}
            onToggleChaos={toggleChaosMode}
          />

          {/* Main Website Sections */}
          <main id="main-content" role="main">
            {/* Hero Section */}
            <Hero
              onOpenSecret={openSecretRoom}
              chaosMode={chaosMode}
              onToggleChaos={toggleChaosMode}
            />

            {/* Character Sheet / Bio Section */}
            <CharacterSheet />

            {/* Interactive Projects: Story Repair Shop, Memory Lantern, Dream Route */}
            <section id="creations" className="projects-container">
              <StoryRepairShop />
              <MemoryLantern />
              <DreamRoute />
            </section>

            {/* Story Timeline / Origin Story */}
            <StoryTimeline />

            {/* Community Memory Collection & Interactive Guestbook */}
            <MemoryCollection />
          </main>

          {/* Secret Dream Room Modal / Easter Egg */}
          <SecretDreamRoom
            isOpen={isSecretRoomOpen}
            onClose={closeSecretRoom}
            chaosMode={chaosMode}
          />

          {/* Footer */}
          <Footer
            onOpenSecret={openSecretRoom}
            chaosMode={chaosMode}
            onToggleChaos={toggleChaosMode}
          />
        </div>
      </SoundContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
