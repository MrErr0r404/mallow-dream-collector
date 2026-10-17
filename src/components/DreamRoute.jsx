import React, { useState, useEffect, useRef, useContext } from 'react';
import { SoundContext } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Play, RotateCcw, Star, Pause, Sparkles, CheckCircle2 } from 'lucide-react';
import './DreamRoute.css';

const STOPS = [
  {
    id: 1,
    name: 'Sleepy Hollow Cottage',
    dream: 'A dream about flying over sunflower fields',
    icon: '🌻',
    x: 65,
    y: 255,
    tag: 'Stop 01',
    description: 'A cozy thatched cottage with honeyed flower beds.',
  },
  {
    id: 2,
    name: 'The Moonlit Bakery',
    dream: 'A dream about a cake that never runs out',
    icon: '🥐',
    x: 115,
    y: 135,
    tag: 'Stop 02',
    description: 'Where the scent of cinnamon and powdered sugar drifts into the night.',
  },
  {
    id: 3,
    name: "Stargazer's Tower",
    dream: 'A dream about counting every star by name',
    icon: '🔭',
    x: 235,
    y: 75,
    tag: 'Stop 03',
    description: 'A winding stone turret that reaches toward the constellations.',
  },
  {
    id: 4,
    name: 'The Cozy Den',
    dream: 'A dream about a warm blanket that tells stories',
    icon: '☕',
    x: 335,
    y: 185,
    tag: 'Stop 04',
    description: 'A burrow under the roots with an amber hearth.',
  },
  {
    id: 5,
    name: 'Lullaby Bridge',
    dream: 'A dream about a river that sings you to sleep',
    icon: '🌊',
    x: 220,
    y: 300,
    tag: 'Stop 05',
    description: 'An ancient arched stone bridge where the river hums soft chords.',
  },
];

// SVG Route Path connecting the 5 stops smoothly
const ROUTE_PATH_DATA =
  'M 65 255 C 55 190, 85 155, 115 135 C 145 110, 185 65, 235 75 C 285 85, 345 130, 335 185 C 325 240, 280 290, 220 300';

export default function DreamRoute() {
  const soundContext = useContext(SoundContext);
  const pathRef = useRef(null);

  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mallowPos, setMallowPos] = useState({ x: STOPS[0].x, y: STOPS[0].y });
  const [pathProgress, setPathProgress] = useState(0); // 0 to 1
  const [totalLength, setTotalLength] = useState(500);
  const [stopDistances, setStopDistances] = useState([0, 125, 250, 375, 500]);

  const animFrameRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const currentLegRef = useRef(0);

  // Measure path length and locate stops along path
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        setTotalLength(len);

        // Precompute distance along path for each stop to guarantee exact alignment
        const computedDistances = STOPS.map((stop) => {
          let bestD = 0;
          let minDiff = Infinity;
          // Step along path to find closest point
          const step = Math.max(1, len / 200);
          for (let d = 0; d <= len; d += step) {
            const pt = pathRef.current.getPointAtLength(d);
            const dist = Math.hypot(pt.x - stop.x, pt.y - stop.y);
            if (dist < minDiff) {
              minDiff = dist;
              bestD = d;
            }
          }
          return bestD;
        });

        // Ensure strictly non-decreasing
        computedDistances[0] = 0;
        computedDistances[STOPS.length - 1] = len;
        setStopDistances(computedDistances);
      } catch (err) {
        console.warn('Could not compute SVG path length:', err);
      }
    }
  }, []);

  // Cleanup timers & animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Safe sound trigger
  const playStopChime = () => {
    try {
      soundContext?.playChime?.();
    } catch {
      // safe fallback
    }
  };

  // Move Mallow smoothly from current stop to target stop
  const animateToStop = (targetIndex) => {
    if (!pathRef.current) return;

    const fromIndex = currentStopIndex;
    const startDist = stopDistances[fromIndex] || 0;
    const endDist = stopDistances[targetIndex] || totalLength;
    const duration = 1200; // ms per leg
    const startTime = performance.now();

    const stepAnimation = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease in-out cubic
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentDist = startDist + (endDist - startDist) * ease;
      const pt = pathRef.current.getPointAtLength(currentDist);
      setMallowPos({ x: pt.x, y: pt.y });
      setPathProgress(currentDist / totalLength);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(stepAnimation);
      } else {
        // Reached target stop
        setCurrentStopIndex(targetIndex);
        playStopChime();

        if (targetIndex >= STOPS.length - 1) {
          // Completed route!
          setIsCompleted(true);
          setIsPlaying(false);
        } else {
          // Dwell at the stop, then deliver to next
          pauseTimerRef.current = setTimeout(() => {
            currentLegRef.current = targetIndex + 1;
            animateToStop(targetIndex + 1);
          }, 1100);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(stepAnimation);
  };

  // Start or restart delivery
  const handleStartDelivery = () => {
    try {
      soundContext?.playClick?.();
    } catch {}

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    setIsPlaying(true);
    setIsCompleted(false);

    if (currentStopIndex >= STOPS.length - 1) {
      // Restart from first stop
      setCurrentStopIndex(0);
      setPathProgress(0);
      setMallowPos({ x: STOPS[0].x, y: STOPS[0].y });
      currentLegRef.current = 1;
      pauseTimerRef.current = setTimeout(() => {
        animateToStop(1);
      }, 500);
    } else {
      const nextIndex = currentStopIndex + 1;
      currentLegRef.current = nextIndex;
      animateToStop(nextIndex);
    }
  };

  // Pause delivery
  const handlePauseDelivery = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsPlaying(false);
  };

  // Direct click on a stop marker
  const handleSelectStop = (index) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    setIsPlaying(false);
    setCurrentStopIndex(index);
    const targetDist = stopDistances[index] || 0;
    setPathProgress(targetDist / (totalLength || 1));
    setMallowPos({ x: STOPS[index].x, y: STOPS[index].y });
    playStopChime();

    if (index === STOPS.length - 1) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const currentStop = STOPS[currentStopIndex];
  const progressPercent = Math.round(((currentStopIndex + 1) / STOPS.length) * 100);

  return (
    <section className="route-section" id="dream-route">
      <div className="route-container">
        {/* Section Header */}
        <div className="route-header">
          <span className="route-badge">✦ CREATION NO. 003</span>
          <h2 className="route-title">The Dream Delivery Route</h2>
          <p className="route-description">
            Follow Mallow on tonight&apos;s dream delivery route through the tiny magical neighborhood.
          </p>
        </div>

        {/* Map and Info Layout */}
        <div className="route-stage-card">
          {/* Top Control Bar */}
          <div className="route-controls-bar">
            <div className="route-progress-info">
              <Star size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px', color: '#f4cc77', fill: '#f4cc77' }} />
              <span className="progress-label">Delivery Progress:</span>
              <span className="progress-fraction">
                <strong>{currentStopIndex + 1}</strong> / {STOPS.length} Stops
              </span>
            </div>

            {/* Progress Bar */}
            <div className="route-progress-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
              <div className="route-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Control Actions */}
            <div className="route-action-buttons">
              {!isCompleted ? (
                isPlaying ? (
                  <button
                    type="button"
                    onClick={handlePauseDelivery}
                    className="route-btn route-btn-secondary"
                  >
                    <Pause size={16} />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartDelivery}
                    className="route-btn route-btn-primary"
                  >
                    <Play size={16} />
                    <span>{currentStopIndex === 0 ? 'Start Delivery' : 'Resume Delivery'}</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={handleStartDelivery}
                  className="route-btn route-btn-accent"
                >
                  <RotateCcw size={16} />
                  <span>Replay Route</span>
                </button>
              )}
            </div>
          </div>

          {/* SVG Magical Map */}
          <div className="svg-map-wrapper">
            <svg
              viewBox="0 0 400 350"
              className="dream-map-svg"
              aria-label="Hand-drawn map of Mallow's dream delivery route"
              role="img"
            >
              <defs>
                {/* Night sky gradient */}
                <radialGradient id="mapNightSky" cx="50%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#2c244d" />
                  <stop offset="50%" stopColor="#211d3a" />
                  <stop offset="100%" stopColor="#18142b" />
                </radialGradient>

                {/* Route Glow Filter */}
                <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Lantern & Mallow Glow */}
                <filter id="mallowAura" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Soft ground hills */}
                <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#352e5c" />
                  <stop offset="100%" stopColor="#231f3e" />
                </linearGradient>
                <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#43507d" />
                  <stop offset="50%" stopColor="#6076b4" />
                  <stop offset="100%" stopColor="#3b446a" />
                </linearGradient>
              </defs>

              {/* Map Canvas Background */}
              <rect x="0" y="0" width="400" height="350" rx="18" fill="url(#mapNightSky)" />

              {/* Background Hills & Scenery */}
              <path
                d="M 0 220 Q 90 180 200 210 T 400 190 L 400 350 L 0 350 Z"
                fill="url(#hillGrad1)"
                opacity="0.85"
              />

              {/* Meandering Lullaby River under bridge */}
              <path
                d="M 120 350 C 160 310, 200 320, 240 280 C 270 250, 280 220, 310 200"
                fill="none"
                stroke="url(#riverGrad)"
                strokeWidth="24"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 130 350 C 165 315, 205 325, 245 285"
                fill="none"
                stroke="#c7b5f5"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                opacity="0.6"
              />

              {/* Stars in Sky */}
              <g className="map-stars" fill="#f4cc77">
                <circle cx="35" cy="45" r="1.5" opacity="0.8" />
                <polygon points="120,30 122,34 126,35 123,37 124,41 120,39 116,41 117,37 114,35 118,34" opacity="0.9" />
                <circle cx="170" cy="50" r="1.2" opacity="0.7" />
                <polygon points="280,25 281.5,28 285,29 282.5,31 283,34 280,32.5 277,34 277.5,31 275,29 278.5,28" opacity="0.85" />
                <circle cx="350" cy="65" r="1.8" opacity="0.75" />
                <circle cx="380" cy="110" r="1.2" opacity="0.6" />
                <circle cx="50" cy="170" r="1.4" opacity="0.7" />
              </g>

              {/* Crescent Moon */}
              <g transform="translate(320, 25)">
                <path
                  d="M 22 0 A 18 18 0 1 0 22 36 A 14 14 0 1 1 22 0 Z"
                  fill="#f4cc77"
                  filter="url(#mallowAura)"
                />
                <circle cx="16" cy="14" r="1.5" fill="#5c4033" opacity="0.4" />
                <path d="M 12 20 Q 15 22 17 20" fill="none" stroke="#5c4033" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
              </g>

              {/* The Static Dream Path (dim background track) */}
              <path
                d={ROUTE_PATH_DATA}
                fill="none"
                stroke="rgba(199, 181, 245, 0.22)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="6 8"
              />

              {/* The Active Animated Route Path (Glowing Gold/Lavender) */}
              <path
                ref={pathRef}
                d={ROUTE_PATH_DATA}
                fill="none"
                stroke="#f4cc77"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#routeGlow)"
                strokeDasharray={totalLength}
                strokeDashoffset={totalLength * (1 - pathProgress)}
                style={{ transition: isPlaying ? 'none' : 'stroke-dashoffset 0.4s ease-out' }}
              />

              {/* Whimsical Houses / Architecture for each stop */}

              {/* Stop 1: Sleepy Hollow Cottage (x=65, y=255) */}
              <g className="map-building" transform="translate(42, 230)">
                <polygon points="23,0 46,16 0,16" fill="#f6dce8" stroke="#5c4033" strokeWidth="1.2" />
                <rect x="6" y="16" width="34" height="22" fill="#fff8f1" stroke="#5c4033" strokeWidth="1.2" rx="1" />
                <rect x="8" y="2" width="5" height="10" fill="#a34063" />
                {/* Windows with warm yellow light */}
                <rect x="11" y="21" width="8" height="8" fill="#f4cc77" rx="1" />
                <rect x="27" y="21" width="8" height="8" fill="#f4cc77" rx="1" />
                <rect x="19" y="26" width="8" height="12" fill="#a34063" rx="1" />
              </g>

              {/* Stop 2: The Moonlit Bakery (x=115, y=135) */}
              <g className="map-building" transform="translate(93, 110)">
                <polygon points="22,0 44,15 0,15" fill="#f4cc77" stroke="#5c4033" strokeWidth="1.2" />
                <rect x="4" y="15" width="36" height="25" fill="#fff8f1" stroke="#5c4033" strokeWidth="1.2" rx="1" />
                {/* Bakery awning stripes */}
                <path d="M 4 15 L 40 15 L 40 21 L 4 21 Z" fill="#a34063" />
                <rect x="10" y="24" width="9" height="9" fill="#f4cc77" rx="1" />
                <rect x="25" y="24" width="10" height="16" fill="#5c4033" rx="1" />
                {/* Chimney aroma swirl */}
                <path d="M 36 6 Q 40 0 36 -6" fill="none" stroke="#eee7ff" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
              </g>

              {/* Stop 3: Stargazer's Tower (x=235, y=75) */}
              <g className="map-building" transform="translate(217, 45)">
                {/* Turret cone roof */}
                <polygon points="18,0 36,22 0,22" fill="#c7b5f5" stroke="#5c4033" strokeWidth="1.2" />
                <polygon points="18,-4 20,0 16,0" fill="#f4cc77" />
                <rect x="6" y="22" width="24" height="38" fill="#fff8f1" stroke="#5c4033" strokeWidth="1.2" rx="2" />
                {/* Arched windows */}
                <path d="M 14 30 A 4 4 0 0 1 22 30 L 22 38 L 14 38 Z" fill="#f4cc77" />
                <path d="M 14 46 A 4 4 0 0 1 22 46 L 22 54 L 14 54 Z" fill="#f4cc77" />
              </g>

              {/* Stop 4: The Cozy Den (x=335, y=185) */}
              <g className="map-building" transform="translate(315, 160)">
                <path d="M 0 18 Q 20 0 40 18 Z" fill="#f6dce8" stroke="#5c4033" strokeWidth="1.2" />
                <rect x="4" y="18" width="32" height="22" fill="#fff8f1" stroke="#5c4033" strokeWidth="1.2" rx="2" />
                <rect x="28" y="4" width="5" height="10" fill="#a34063" />
                <rect x="9" y="24" width="8" height="8" fill="#f4cc77" rx="1" />
                <rect x="23" y="24" width="8" height="8" fill="#f4cc77" rx="1" />
              </g>

              {/* Stop 5: Lullaby Bridge (x=220, y=300) */}
              <g className="map-building" transform="translate(196, 280)">
                {/* Stone Bridge Arch */}
                <path
                  d="M 0 24 C 10 14, 38 14, 48 24 L 48 29 C 36 21, 12 21, 0 29 Z"
                  fill="#c7b5f5"
                  stroke="#5c4033"
                  strokeWidth="1.2"
                />
                <circle cx="6" cy="21" r="3" fill="#eee7ff" stroke="#5c4033" strokeWidth="0.8" />
                <circle cx="42" cy="21" r="3" fill="#eee7ff" stroke="#5c4033" strokeWidth="0.8" />
              </g>

              {/* Interactive Stop Pins & Markers */}
              {STOPS.map((stop, index) => {
                const isSelected = currentStopIndex === index;
                const isVisited = currentStopIndex >= index;

                return (
                  <g
                    key={stop.id}
                    className={`map-stop-group ${isSelected ? 'is-current' : ''}`}
                    onClick={() => handleSelectStop(index)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Jump to stop ${index + 1}: ${stop.name}`}
                  >
                    {/* Pulsing ring when active */}
                    {isSelected && (
                      <circle
                        cx={stop.x}
                        cy={stop.y}
                        r="18"
                        fill="none"
                        stroke="#f4cc77"
                        strokeWidth="2"
                        opacity="0.8"
                        className="pulse-ring"
                      />
                    )}

                    {/* Outer Pin Base */}
                    <circle
                      cx={stop.x}
                      cy={stop.y}
                      r="12"
                      fill={isVisited ? '#f4cc77' : '#eee7ff'}
                      stroke="#5c4033"
                      strokeWidth="1.5"
                      filter="url(#routeGlow)"
                    />

                    {/* Inner Stop Number or Star */}
                    <text
                      x={stop.x}
                      y={stop.y + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="Fredoka, sans-serif"
                      fontWeight="700"
                      fill="#211d3a"
                    >
                      {index + 1}
                    </text>

                    {/* Small stop name tooltip / label */}
                    <text
                      x={stop.x}
                      y={stop.y - 16}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="Fredoka, sans-serif"
                      fontWeight="600"
                      fill={isSelected ? '#f4cc77' : '#eee7ff'}
                      opacity={isSelected ? 1 : 0.75}
                      className="stop-map-name"
                    >
                      {stop.name}
                    </text>
                  </g>
                );
              })}

              {/* Mallow, The Little Dream Collector Icon! */}
              <g
                className="mallow-traveler"
                transform={`translate(${mallowPos.x}, ${mallowPos.y})`}
                filter="url(#mallowAura)"
              >
                {/* Floating Shadow */}
                <ellipse cx="0" cy="14" rx="8" ry="3" fill="#000" opacity="0.3" />

                {/* Ghost Body (Lavender) */}
                <path
                  d="M -9 4 C -9 -8, 9 -8, 9 4 C 9 10, 6 12, 3 10 C 0 12, -3 10, -6 12 C -9 10, -9 4, -9 4 Z"
                  fill="#eee7ff"
                  stroke="#c7b5f5"
                  strokeWidth="1"
                />

                {/* Dark Plum Eyes */}
                <circle cx="-3" cy="1" r="1.3" fill="#211d3a" />
                <circle cx="3" cy="1" r="1.3" fill="#211d3a" />

                {/* Rosy Cheeks */}
                <circle cx="-5" cy="4" r="1.1" fill="#f6dce8" />
                <circle cx="5" cy="4" r="1.1" fill="#f6dce8" />

                {/* Golden Star on Forehead */}
                <polygon
                  points="0,-6 1,-4 3,-4 1.5,-2.5 2,-0.5 0,-2 -2,-0.5 -1.5,-2.5 -3,-4 -1,-4"
                  fill="#f4cc77"
                />

                {/* Little Star Lantern held in hand */}
                <g transform="translate(10, 4)">
                  <line x1="-3" y1="-2" x2="0" y2="2" stroke="#5c4033" strokeWidth="0.8" />
                  <polygon
                    points="0,2 2,5 5,5 2.5,7 3.5,10 0,8 -3.5,10 -2.5,7 -5,5 -2,5"
                    fill="#f4cc77"
                    filter="url(#routeGlow)"
                  />
                </g>
              </g>
            </svg>
          </div>

          {/* Current Stop Dream Delivery Card */}
          <div className="current-stop-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStop.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="stop-info-content"
              >
                <div className="stop-card-header">
                  <div className="stop-icon-badge">
                    <span className="stop-emoji" aria-hidden="true">{currentStop.icon}</span>
                  </div>
                  <div className="stop-title-wrap">
                    <div className="stop-tag-row">
                      <span className="stop-tag">{currentStop.tag}</span>
                      <span className="stop-status-pill">
                        <MapPin size={12} /> Delivering Dream
                      </span>
                    </div>
                    <h3 className="stop-name">{currentStop.name}</h3>
                  </div>
                </div>

                <div className="stop-dream-box">
                  <span className="dream-label">
                    <Sparkles size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                    Dream being delivered:
                  </span>
                  <p className="dream-text">“{currentStop.dream}”</p>
                </div>

                <p className="stop-desc">{currentStop.description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Delivery Completion Message */}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="delivery-completed-banner"
              >
                <CheckCircle2 size={18} className="complete-icon" />
                <div className="complete-text-wrap">
                  <strong>Delivery Route Finished!</strong>
                  <span>All 5 dreams safely delivered. The neighborhood sleeps in peace. ✦</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
