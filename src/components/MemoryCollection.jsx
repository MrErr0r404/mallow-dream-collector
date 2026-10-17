import React, { useState, useEffect, useContext } from 'react';
import { SoundContext } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Trash2, Archive, Star, Sparkles } from 'lucide-react';
import './MemoryCollection.css';

const STORAGE_KEY = 'mallow-visitor-memories';
const MAX_CHARS = 280;

const DEFAULT_MEMORIES = [
  {
    id: 'default-1',
    text: 'Watching the rain trace sleepy patterns down my window while wrapped in my softest blanket.',
    createdAt: 'Autumn evening'
  },
  {
    id: 'default-2',
    text: 'A late night car ride where the moon seemed to follow us all the way back home.',
    createdAt: 'Midnight memory'
  }
];

export default function MemoryCollection() {
  const soundContext = useContext(SoundContext);
  const [memoryText, setMemoryText] = useState('');
  const [memories, setMemories] = useState([]);
  const [submittedMemory, setSubmittedMemory] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Load memories from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMemories(parsed.slice(0, 5));
          return;
        }
      }
      // If empty, initialize with gentle defaults
      setMemories(DEFAULT_MEMORIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEMORIES));
    } catch (e) {
      console.warn('Could not read localStorage for memories:', e);
      setMemories(DEFAULT_MEMORIES);
    }
  }, []);

  const saveMemoriesToStorage = (updated) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = memoryText.trim();
    if (!trimmed) return;

    if (soundContext?.playBell) {
      soundContext.playBell();
    }

    const newMemory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: trimmed,
      createdAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newMemory, ...memories].slice(0, 5);
    setMemories(updated);
    saveMemoriesToStorage(updated);
    setSubmittedMemory(newMemory);
    setHasSubmitted(true);
    setMemoryText('');
  };

  const handleDelete = (id) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    saveMemoriesToStorage(updated);
  };

  const handleClearAll = () => {
    setMemories([]);
    saveMemoriesToStorage([]);
  };

  const handleReset = () => {
    setHasSubmitted(false);
    setSubmittedMemory(null);
  };

  const charsRemaining = MAX_CHARS - memoryText.length;
  const isTooLong = charsRemaining < 0;

  return (
    <section id="memories" className="memories-section">
      <div className="memories-container">
        {/* Header */}
        <div className="memories-header">
          <div className="memories-eyebrow">✦ YOUR LITTLE MEMORY</div>
          <h2 className="memories-title">Leave a Dream in Mallow's Library</h2>
          <p className="memories-desc">
            Share a small happy memory or dream. Mallow will keep it safe.
          </p>
        </div>

        {/* Input Form or Success Card */}
        <motion.div
          className="memory-form-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {!hasSubmitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="memory-input-group">
                  <label htmlFor="memory-input" className="memory-label">
                    <span>Your memory or dream</span>
                    <span
                      className="char-counter"
                      style={{ color: isTooLong ? '#e53e3e' : undefined }}
                    >
                      {memoryText.length} / {MAX_CHARS}
                    </span>
                  </label>
                  <textarea
                    id="memory-input"
                    className="memory-textarea"
                    placeholder="I once saw a rainbow that seemed close enough to touch..."
                    value={memoryText}
                    maxLength={MAX_CHARS}
                    onChange={(e) => setMemoryText(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="memory-form-actions">
                  <button
                    type="submit"
                    className="memory-submit-btn"
                    disabled={!memoryText.trim() || isTooLong}
                  >
                    <span>Leave this memory ✦</span>
                    <Send size={18} aria-hidden="true" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="memory-success-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <div className="memory-success-badge">
                  <Sparkles size={18} />
                  <span>✦ Mallow has placed your memory safely in the library!</span>
                </div>

                {submittedMemory && (
                  <div className="memory-success-card">
                    <p className="memory-success-text">
                      "{submittedMemory.text}"
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="memory-reset-btn"
                  onClick={handleReset}
                >
                  <span>Leave another memory</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Saved Memories Library Shelf */}
        <div className="saved-memories-wrapper">
          <div className="saved-memories-top">
            <h3 className="saved-memories-title">
              <Archive size={22} aria-hidden="true" />
              <span>Memories in the Library</span>
            </h3>

            {memories.length > 0 && (
              <button
                type="button"
                className="clear-memories-btn"
                onClick={handleClearAll}
                title="Clear all memories from this browser"
              >
                <Trash2 size={14} aria-hidden="true" />
                <span>Clear all memories</span>
              </button>
            )}
          </div>

          {memories.length === 0 ? (
            <div className="empty-memories-note">
              No dreams saved in your browser yet. Write your first memory above!
            </div>
          ) : (
            <div className="saved-memories-grid">
              {memories.map((m) => (
                <motion.div
                  key={m.id}
                  className="saved-memory-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="saved-memory-header">
                    <span className="saved-memory-star" aria-hidden="true">⭐</span>
                    <button
                      type="button"
                      className="saved-memory-delete"
                      onClick={() => handleDelete(m.id)}
                      title="Remove this memory"
                      aria-label="Remove this memory"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="saved-memory-text">{m.text}</p>

                  <div className="saved-memory-date">
                    <span>{m.createdAt}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy label */}
        <div className="privacy-badge">
          <span>🔒 Your memories live only in your browser — just for you.</span>
        </div>
      </div>
    </section>
  );
}
