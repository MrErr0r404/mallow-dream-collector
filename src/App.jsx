import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useSound } from './hooks/useSound';

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

  useEffect(() => {
    const secretKeywords = ['mallow', 'dream', 'star'];

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
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
          <SparkleTrail chaosMode={chaosMode} />

          <Navbar
            onOpenSecret={openSecretRoom}
            chaosMode={chaosMode}
            onToggleChaos={toggleChaosMode}
          />

          <main id="main-content" role="main">
            <Hero
              onOpenSecret={openSecretRoom}
              chaosMode={chaosMode}
              onToggleChaos={toggleChaosMode}
            />

            <CharacterSheet />

            <section id="creations" className="projects-container">
              <StoryRepairShop />
              <MemoryLantern />
              <DreamRoute />
            </section>

            <StoryTimeline />

            <MemoryCollection />
          </main>

          <SecretDreamRoom
            isOpen={isSecretRoomOpen}
            onClose={closeSecretRoom}
            chaosMode={chaosMode}
          />

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
