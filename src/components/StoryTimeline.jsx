import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { story } from '../data/story';
import './StoryTimeline.css';

export default function StoryTimeline() {
  const containerRef = useRef(null);
  const sceneRefs = useRef([]);
  const [visibleScenes, setVisibleScenes] = useState({});
  const [progressPercent, setProgressPercent] = useState(0);

  // IntersectionObserver to track visible scenes and calculate progress
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (!isNaN(index)) {
            setVisibleScenes((prev) => ({
              ...prev,
              [index]: entry.isIntersecting
            }));
          }
        });
      },
      {
        threshold: [0.3]
      }
    );

    const currentRefs = sceneRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Update timeline fill based on visible scenes
  useEffect(() => {
    const indices = Object.keys(visibleScenes)
      .map(Number)
      .filter((idx) => visibleScenes[idx]);

    if (indices.length === 0) {
      setProgressPercent(10);
    } else {
      const maxIndex = Math.max(...indices);
      const total = story.length - 1;
      const pct = Math.min(100, Math.max(15, ((maxIndex + 1) / story.length) * 100));
      setProgressPercent(pct);
    }
  }, [visibleScenes]);

  // Render specific decorative art for each scene
  const renderSceneDecoration = (scene, index) => {
    switch (index) {
      case 0:
        return (
          <div className="art-books" aria-hidden="true">
            <span className="floating-pages">📖</span>
            <div className="books-row">
              <div className="book book-1"></div>
              <div className="book book-2"></div>
              <div className="book book-3"></div>
              <div className="book book-4"></div>
              <div className="book book-5"></div>
            </div>
            <div className="bookshelf-decor"></div>
          </div>
        );
      case 1:
        return (
          <div className="art-starglow" aria-hidden="true">
            <div className="star-aura"></div>
            <span className="star-center">⭐</span>
            <span className="star-mini">✦</span>
            <span className="star-mini">✧</span>
            <span className="star-mini">✦</span>
            <span className="star-mini">✧</span>
          </div>
        );
      case 2:
        return (
          <div className="art-goldenlight" aria-hidden="true">
            <div className="lantern-glow-rays"></div>
            <span className="lantern-icon">🏮</span>
            <span className="lantern-sparkle">✨</span>
            <span className="lantern-sparkle">✦</span>
            <span className="lantern-sparkle">💛</span>
          </div>
        );
      case 3:
      default:
        return (
          <div className="art-moon" aria-hidden="true">
            <span className="moon-orb">🌙</span>
            <div className="dream-bubbles">
              <span className="dream-bubble"></span>
              <span className="dream-bubble"></span>
              <span className="dream-bubble"></span>
            </div>
          </div>
        );
    }
  };

  const scrollToScene = (index) => {
    sceneRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <section id="story" className="story-section" ref={containerRef}>
      <div className="story-container">
        {/* Header */}
        <div className="story-header">
          <div className="story-eyebrow">✦ MALLOW'S ORIGIN</div>
          <h2 className="story-title">How It All Began</h2>
          <p className="story-subtitle">
            Follow the gentle steps of a tiny ghost who discovered that unfinished tales hold the warmest magic.
          </p>
        </div>

        {/* Timeline Structure */}
        <div className="story-timeline-wrapper">
          {/* Vertical progress line */}
          <div className="story-timeline-line" aria-hidden="true">
            <div
              className="story-timeline-fill"
              style={{ height: `${progressPercent}%` }}
            />
          </div>

          {/* Scenes */}
          <div className="story-scenes">
            {story.map((scene, index) => {
              const isEven = index % 2 === 1;
              const isActive = !!visibleScenes[index];

              return (
                <div
                  key={scene.id || index}
                  ref={(el) => (sceneRefs.current[index] = el)}
                  data-index={index}
                  className={`story-scene-row ${isEven ? 'row-even' : 'row-odd'} ${
                    isActive ? 'is-active' : ''
                  }`}
                >
                  {/* Content Column */}
                  <motion.div
                    className="story-content-col"
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.65, delay: 0.1 }}
                  >
                    <div className="story-card">
                      <span className="story-chapter-tag">
                        {scene.chapter || `CHAPTER 0${index + 1}`}
                      </span>
                      <h3 className="story-scene-title">{scene.title}</h3>
                      <p className="story-scene-text">{scene.text}</p>
                      {(scene.tagline || scene.subtitle) && (
                        <p className="story-scene-quote">
                          <span>“</span>
                          {scene.tagline || scene.subtitle}
                          <span>”</span>
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Marker Dot */}
                  <div className="story-marker-col">
                    <button
                      type="button"
                      className="story-marker-dot"
                      onClick={() => scrollToScene(index)}
                      title={`Jump to ${scene.chapter || `Chapter ${index + 1}`}`}
                      aria-label={`Jump to ${scene.chapter || `Chapter ${index + 1}`}: ${scene.title}`}
                    >
                      {scene.emoji || scene.decorations?.[0] || '✦'}
                    </button>
                  </div>

                  {/* Illustration Column */}
                  <motion.div
                    className="story-illustration-col"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.65, delay: 0.2 }}
                  >
                    <div className="story-illustration-box">
                      <div className="story-illustration-art">
                        {renderSceneDecoration(scene, index)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
