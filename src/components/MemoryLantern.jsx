import React, { useState, useEffect, useContext } from 'react';
import { SoundContext } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { Lamp, Plus, Trash2, X, Sparkles, Check, Lock, Heart } from 'lucide-react';
import './MemoryLantern.css';

const DEFAULT_MEMORIES = [
  {
    id: 'default-1',
    text: 'The warmth of sunlight through a window on a quiet morning',
    colorKey: 'gold',
    label: 'Golden Dawn',
    isCustom: false,
  },
  {
    id: 'default-2',
    text: 'A song that makes you think of someone you love',
    colorKey: 'lavender',
    label: 'Soft Melodies',
    isCustom: false,
  },
  {
    id: 'default-3',
    text: 'The sound of rain on a rooftop while reading a good book',
    colorKey: 'mint',
    label: 'Rainy Solace',
    isCustom: false,
  },
  {
    id: 'default-4',
    text: 'A handwritten letter found years later in an old drawer',
    colorKey: 'blush',
    label: 'Old Keepsakes',
    isCustom: false,
  },
  {
    id: 'default-5',
    text: 'The first star you noticed on a clear evening',
    colorKey: 'lilac',
    label: 'Evening Starlight',
    isCustom: false,
  },
  {
    id: 'default-6',
    text: 'The comforting aroma of warm lavender tea shared with a dear friend',
    colorKey: 'gold',
    label: 'Warm Companionship',
    isCustom: false,
  },
];

const COLOR_OPTIONS = [
  { key: 'gold', name: 'Warm Gold', hex: '#f4cc77', glow: 'rgba(244, 204, 119, 0.55)' },
  { key: 'lavender', name: 'Lavender', hex: '#c7b5f5', glow: 'rgba(199, 181, 245, 0.55)' },
  { key: 'blush', name: 'Blush Pink', hex: '#f6dce8', glow: 'rgba(246, 220, 232, 0.55)' },
  { key: 'lilac', name: 'Pale Lilac', hex: '#eee7ff', glow: 'rgba(238, 231, 255, 0.55)' },
  { key: 'mint', name: 'Seafoam Mint', hex: '#bbf2e8', glow: 'rgba(187, 242, 232, 0.55)' },
];

export default function MemoryLantern() {
  const soundContext = useContext(SoundContext);
  const [memories, setMemories] = useState(DEFAULT_MEMORIES);
  const [activeMemoryId, setActiveMemoryId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [selectedColorKey, setSelectedColorKey] = useState('gold');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [formError, setFormError] = useState('');

  // Load custom memories from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mallow-memories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom memories with defaults
          setMemories([...DEFAULT_MEMORIES, ...parsed]);
        }
      }
    } catch (err) {
      console.warn('Could not read mallow-memories from localStorage:', err);
    }
  }, []);

  const activeMemory = memories.find((m) => m.id === activeMemoryId);

  const handleOpenLantern = (memory) => {
    try {
      soundContext?.playClick?.();
    } catch {}
    setActiveMemoryId(memory.id);
  };

  const handleCloseLantern = (e) => {
    if (e) e.stopPropagation();
    try {
      soundContext?.playClick?.();
    } catch {}
    setActiveMemoryId(null);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 200) {
      setInputText(text);
      if (formError) setFormError('');
    }
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();

    if (!trimmed) {
      setFormError('Please write a happy memory before lighting a lantern.');
      return;
    }

    const newMemory = {
      id: `custom-${Date.now()}`,
      text: trimmed,
      colorKey: selectedColorKey,
      label: 'Whispered Memory',
      isCustom: true,
      createdAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };

    // Play bell sound
    try {
      soundContext?.playBell?.();
    } catch {}

    const updatedMemories = [...memories, newMemory];
    setMemories(updatedMemories);

    // Save custom memories to localStorage
    try {
      const customOnly = updatedMemories.filter((m) => m.isCustom);
      localStorage.setItem('mallow-memories', JSON.stringify(customOnly));
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }

    // Reset input
    setInputText('');
    setFormError('');
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3200);

    // Automatically highlight the new memory lantern
    setActiveMemoryId(newMemory.id);
  };

  const handleDeleteMemory = (memoryId, e) => {
    if (e) e.stopPropagation();
    try {
      soundContext?.playClick?.();
    } catch {}

    const updated = memories.filter((m) => m.id !== memoryId);
    setMemories(updated);

    if (activeMemoryId === memoryId) {
      setActiveMemoryId(null);
    }

    // Update localStorage
    try {
      const customOnly = updated.filter((m) => m.isCustom);
      localStorage.setItem('mallow-memories', JSON.stringify(customOnly));
    } catch (err) {
      console.warn('Could not update localStorage after deletion:', err);
    }
  };

  return (
    <section className="lantern-section" id="memory-lantern">
      <div className="lantern-container">
        {/* Section Header */}
        <div className="lantern-header">
          <span className="lantern-badge">✦ CREATION NO. 002</span>
          <h2 className="lantern-title">The Memory Lantern</h2>
          <p className="lantern-description">
            Every happy memory deserves to be kept safe. Click a lantern to see its memory, or add your own.
          </p>
        </div>

        {/* Lanterns Grid */}
        <div className="lanterns-grid" role="region" aria-label="Glowing Memory Lanterns">
          {memories.map((memory, index) => {
            const isActive = activeMemoryId === memory.id;
            return (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className={`lantern-card color-${memory.colorKey} ${isActive ? 'is-active' : ''}`}
                onClick={() => handleOpenLantern(memory)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenLantern(memory);
                  }
                }}
                aria-expanded={isActive}
                aria-label={`Lantern ${index + 1}: ${memory.text}`}
              >
                {/* Floating flame flicker aura */}
                <div className="lantern-aura" aria-hidden="true" />

                {/* Lantern Top Ring & Fixture */}
                <div className="lantern-cap">
                  <div className="lantern-ring" />
                  <div className="lantern-lid" />
                </div>

                {/* Lantern Chamber */}
                <div className="lantern-chamber">
                  <div className="lantern-flame" aria-hidden="true">
                    <span className="flame-core" />
                    <span className="flame-star">✦</span>
                  </div>

                  <div className="lantern-icon-wrap">
                    <Lamp size={26} className="chamber-lamp-icon" />
                  </div>

                  <span className="lantern-tag">
                    {memory.isCustom ? '✦ Your Memory' : memory.label}
                  </span>

                  {/* Preview or expanded text */}
                  <p className="lantern-text-preview">
                    {isActive ? memory.text : `"${memory.text.slice(0, 52)}${memory.text.length > 52 ? '...' : ''}"`}
                  </p>

                  {/* If custom, show trash delete icon */}
                  {memory.isCustom && (
                    <button
                      type="button"
                      className="lantern-delete-btn"
                      onClick={(e) => handleDeleteMemory(memory.id, e)}
                      title="Release this memory"
                      aria-label="Release this memory"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  {/* If active, show close cross */}
                  {isActive && (
                    <button
                      type="button"
                      className="lantern-close-btn"
                      onClick={(e) => handleCloseLantern(e)}
                      title="Close lantern"
                      aria-label="Close lantern view"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Lantern Base */}
                <div className="lantern-base" />
              </motion.div>
            );
          })}
        </div>

        {/* Focused Expanded View Modal (Accessible & Cinematic) */}
        <AnimatePresence>
          {activeMemory && (
            <motion.div
              className="lantern-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseLantern}
            >
              <motion.div
                className={`lantern-modal-card color-${activeMemory.colorKey}`}
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Memory Detail"
              >
                <button
                  type="button"
                  className="modal-close-button"
                  onClick={handleCloseLantern}
                  aria-label="Close memory modal"
                >
                  <X size={18} />
                </button>

                <div className="modal-lantern-visual">
                  <div className="modal-lantern-halo" />
                  <Lamp size={40} className="modal-lamp-icon" />
                  <span className="modal-lantern-star">★</span>
                </div>

                <div className="modal-content">
                  <div className="modal-tag">
                    <Heart size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }} />
                    {activeMemory.isCustom ? 'Kept in your heart' : activeMemory.label}
                  </div>
                  <blockquote className="modal-memory-quote">
                    “{activeMemory.text}”
                  </blockquote>
                  <div className="modal-footer">
                    <span className="modal-mallow-note">
                      <Sparkles size={14} /> Kept glowing safe by Mallow
                    </span>
                    {activeMemory.isCustom && (
                      <button
                        type="button"
                        className="modal-delete-btn"
                        onClick={(e) => handleDeleteMemory(activeMemory.id, e)}
                      >
                        <Trash2 size={13} />
                        <span>Delete memory</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Memory Form Section */}
        <div className="lantern-add-wrapper">
          <div className="lantern-add-card">
            <div className="lantern-add-header">
              <div className="add-header-title-wrap">
                <Plus size={20} className="add-plus-icon" />
                <h3 className="add-heading">Kindle a New Memory Lantern</h3>
              </div>
              <span className="add-subtitle">Mallow will gently tuck it into the night sky</span>
            </div>

            <form onSubmit={handleAddMemory} className="lantern-form">
              <div className="form-group">
                <label htmlFor="memory-text-input" className="form-label">
                  Your Memory
                </label>
                <div className="textarea-wrapper">
                  <textarea
                    id="memory-text-input"
                    className="memory-textarea"
                    placeholder="Share a happy memory..."
                    value={inputText}
                    onChange={handleTextChange}
                    maxLength={200}
                    rows={3}
                  />
                  <div className="textarea-footer">
                    <span className={`char-counter ${inputText.length >= 190 ? 'char-warning' : ''}`}>
                      {inputText.length} / 200
                    </span>
                  </div>
                </div>
                {formError && <p className="form-error-msg">{formError}</p>}
              </div>

              {/* Lantern Color Picker */}
              <div className="color-picker-row">
                <span className="color-picker-label">Lantern Glow:</span>
                <div className="color-options-group" role="radiogroup" aria-label="Lantern glow color">
                  {COLOR_OPTIONS.map((col) => {
                    const isSelected = selectedColorKey === col.key;
                    return (
                      <button
                        type="button"
                        key={col.key}
                        onClick={() => setSelectedColorKey(col.key)}
                        className={`color-chip ${isSelected ? 'is-selected' : ''}`}
                        style={{ '--chip-color': col.hex }}
                        title={col.name}
                        aria-label={`Select ${col.name} glow`}
                        aria-checked={isSelected}
                        role="radio"
                      >
                        {isSelected && <span className="chip-indicator">✦</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action row */}
              <div className="form-action-row">
                <button type="submit" className="lantern-submit-btn">
                  <Sparkles size={16} />
                  <span>Add to the lanterns ✦</span>
                </button>
              </div>

              {/* Success Notification */}
              <AnimatePresence>
                {showSuccessToast && (
                  <motion.div
                    className="lantern-success-toast"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Check size={16} className="toast-check" />
                    <span>Your memory is now glowing bright in the lantern garden!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Privacy Note */}
              <div className="privacy-note">
                <Lock size={13} className="privacy-lock-icon" />
                <span>Your memories are stored locally in your browser, just for you. 🔒</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
