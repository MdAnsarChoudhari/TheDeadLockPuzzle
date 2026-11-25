import React, { useState, useEffect, useCallback, useRef } from 'react';
import DevelopedBy from './DevelopedBy.jsx';

// ==========================================
// 1. GAME LOGIC & HELPER FUNCTIONS
// ==========================================

export const createInitialBoard = (n) => {
  const left = Array(n).fill('L');
  const right = Array(n).fill('R');
  return [...left, null, ...right];
};

export const getPar = (n) => n * n + 2 * n;

export const isSolved = (board, n) => {
  for (let i = 0; i < n; i++) {
    if (board[i] !== 'R') return false;
  }
  if (board[n] !== null) return false;
  for (let i = n + 1; i < board.length; i++) {
    if (board[i] !== 'L') return false;
  }
  return true;
};

export const getValidMove = (board, index) => {
  const piece = board[index];
  if (!piece) return null;

  if (piece === 'L') {
    // Slide 1 space right
    if (index + 1 < board.length && board[index + 1] === null) {
      return { targetIndex: index + 1, type: 'slide' };
    }
    // Hop 2 spaces right over exactly 1 piece
    if (
      index + 2 < board.length &&
      board[index + 1] !== null &&
      board[index + 2] === null
    ) {
      return { targetIndex: index + 2, type: 'hop' };
    }
  } else if (piece === 'R') {
    // Slide 1 space left
    if (index - 1 >= 0 && board[index - 1] === null) {
      return { targetIndex: index - 1, type: 'slide' };
    }
    // Hop 2 spaces left over exactly 1 piece
    if (
      index - 2 >= 0 &&
      board[index - 1] !== null &&
      board[index - 2] === null
    ) {
      return { targetIndex: index - 2, type: 'hop' };
    }
  }

  return null;
};

export const getMovableIndices = (board) => {
  const movable = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null && getValidMove(board, i) !== null) {
      movable.push(i);
    }
  }
  return movable;
};

export const isDeadlocked = (board, n) => {
  if (isSolved(board, n)) return false;
  return getMovableIndices(board).length === 0;
};

// ==========================================
// 2. SYNTHESIZED TACTILE WEB AUDIO ENGINE
// ==========================================

class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSlide() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  playHop() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(460, now);
    osc1.frequency.exponentialRampToValueAtTime(300, now + 0.11);

    osc2.frequency.setValueAtTime(600, now);
    osc2.frequency.exponentialRampToValueAtTime(430, now + 0.11);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.12);
    osc2.stop(now + 0.12);
  }

  playDeadlock() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.28);

    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.29);
  }

  playVictory() {
    this.init();
    if (!this.ctx) return;
    const notes = [329.63, 415.3, 493.88, 659.25];
    notes.forEach((freq, idx) => {
      const startTime = this.ctx.currentTime + idx * 0.085;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.48);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  playUndo() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(230, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.07);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playReset() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(170, now + 0.14);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playInvalid() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(125, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }
}

const sounds = new SoundEngine();

// ==========================================
// 3. BESPOKE VERTICAL 3D CARS ARTWORK (SVG)
// ==========================================

// Vertical Top-Down 3D Cars facing UP (Matching Reference Image)
function VerticalCar({ team, variantIndex = 0, isMovable }) {
  const isCopper = team === 'L';
  const v = variantIndex % 4;

  // Unique IDs for SVG gradients per component instance
  const uid = `${team}-${v}`;

  return (
    <svg
      viewBox="0 0 54 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none pointer-events-none drop-shadow-xl"
    >
      <defs>
        {/* Soft Contact Shadow underneath car */}
        <filter id={`shadow-${uid}`} x="-20%" y="-15%" width="140%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.65 0" />
        </filter>

        {/* Copper Metallic Paint Gradients */}
        <linearGradient id={`copper-grad-${uid}`} x1="8" y1="48" x2="46" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="18%" stopColor="#B45309" />
          <stop offset="48%" stopColor="#D97706" />
          <stop offset="78%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <linearGradient id={`copper-roof-${uid}`} x1="16" y1="20" x2="38" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Steel / Cyan Metallic Paint Gradients */}
        <linearGradient id={`cyan-grad-${uid}`} x1="8" y1="48" x2="46" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0C4A6E" />
          <stop offset="18%" stopColor="#0284C7" />
          <stop offset="48%" stopColor="#38BDF8" />
          <stop offset="78%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        <linearGradient id={`cyan-roof-${uid}`} x1="16" y1="20" x2="38" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Tinted Cockpit Glass */}
        <linearGradient id={`glass-${uid}`} x1="27" y1="25" x2="27" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#090D16" />
        </linearGradient>

        {/* Headlight Forward Glow Beams */}
        <linearGradient id={`beam-copper-${uid}`} x1="27" y1="12" x2="27" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`beam-cyan-${uid}`} x1="27" y1="12" x2="27" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ground Contact Shadow */}
      <rect x="7" y="10" width="40" height="78" rx="14" fill="#000000" filter={`url(#shadow-${uid})`} />

      {/* 4 Wheels / Tires tucked in fender bays */}
      <rect x="4" y="20" width="5.5" height="15" rx="2.5" fill="#121214" stroke="#333" strokeWidth="0.5" />
      <rect x="44.5" y="20" width="5.5" height="15" rx="2.5" fill="#121214" stroke="#333" strokeWidth="0.5" />
      <rect x="4" y="62" width="5.5" height="15" rx="2.5" fill="#121214" stroke="#333" strokeWidth="0.5" />
      <rect x="44.5" y="62" width="5.5" height="15" rx="2.5" fill="#121214" stroke="#333" strokeWidth="0.5" />

      {/* Aerodynamic Body Silhouette with variant nuances */}
      {v === 0 && (
        // Variant 0: Sculpted GT Coupe
        <path
          d="M 18 10 C 24 8, 30 8, 36 10 C 44 12, 46 22, 46 36 C 46 54, 47 70, 44 82 C 42 86, 36 88, 27 88 C 18 88, 12 86, 10 82 C 7 70, 8 54, 8 36 C 8 22, 10 12, 18 10 Z"
          fill={isCopper ? `url(#copper-grad-${uid})` : `url(#cyan-grad-${uid})`}
        />
      )}
      {v === 1 && (
        // Variant 1: Muscular Fastback
        <path
          d="M 19 9 C 24 7.5, 30 7.5, 35 9 C 43 11, 47 20, 47 34 C 47 52, 48 72, 45 84 C 42 88, 36 89, 27 89 C 18 89, 12 88, 9 84 C 6 72, 7 52, 7 34 C 7 20, 11 11, 19 9 Z"
          fill={isCopper ? `url(#copper-grad-${uid})` : `url(#cyan-grad-${uid})`}
        />
      )}
      {v === 2 && (
        // Variant 2: Supercar Silhouette
        <path
          d="M 17 11 C 24 8.5, 30 8.5, 37 11 C 45 13, 46 24, 46 38 C 46 56, 47 68, 44 81 C 42 85, 35 87, 27 87 C 19 87, 12 85, 10 81 C 7 68, 8 56, 8 38 C 8 24, 9 13, 17 11 Z"
          fill={isCopper ? `url(#copper-grad-${uid})` : `url(#cyan-grad-${uid})`}
        />
      )}
      {v === 3 && (
        // Variant 3: Compact Performance Sports Car
        <path
          d="M 18 10 C 24 8, 30 8, 36 10 C 44 12, 45 22, 45 35 C 45 53, 46 69, 44 83 C 42 87, 36 88.5, 27 88.5 C 18 88.5, 12 87, 10 83 C 8 69, 9 53, 9 35 C 9 22, 10 12, 18 10 Z"
          fill={isCopper ? `url(#copper-grad-${uid})` : `url(#cyan-grad-${uid})`}
        />
      )}

      {/* Side Mirrors */}
      <rect x="4" y="32" width="3.5" height="5" rx="1.5" fill={isCopper ? '#B45309' : '#0284C7'} />
      <rect x="46.5" y="32" width="3.5" height="5" rx="1.5" fill={isCopper ? '#B45309' : '#0284C7'} />

      {/* Hood Creases / Vents */}
      <path d="M 20 18 Q 27 20 34 18" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="0.8" fill="none" />
      <path d="M 22 14 L 23 23" stroke="#000000" strokeOpacity="0.25" strokeWidth="0.8" />
      <path d="M 32 14 L 31 23" stroke="#000000" strokeOpacity="0.25" strokeWidth="0.8" />

      {/* Cabin Glass Greenhouse (Front Windshield, Roof, Rear Window) */}
      <path
        d="M 17 30 C 23 27, 31 27, 37 30 C 40 33, 40 44, 40 58 C 40 68, 38 73, 35 74 C 30 76, 24 76, 19 74 C 16 73, 14 68, 14 58 C 14 44, 14 33, 17 30 Z"
        fill={`url(#glass-${uid})`}
      />

      {/* Front Windshield Specular Reflection Curved Slash */}
      <path
        d="M 19 32 Q 27 29 35 32 Q 33 39 31 43 Q 27 38 19 32 Z"
        fill="#FFFFFF"
        fillOpacity="0.28"
      />

      {/* Roof Metal Bridge between Windshield & Rear Window */}
      <rect
        x="17"
        y="45"
        width="20"
        height="14"
        rx="2"
        fill={isCopper ? `url(#copper-roof-${uid})` : `url(#cyan-roof-${uid})`}
      />

      {/* Rear Window Glass Reflection */}
      <ellipse cx="27" cy="67" rx="8" ry="3.5" fill="#FFFFFF" fillOpacity="0.16" />

      {/* Headlights at the Top (Facing Forward / Up) */}
      {isCopper ? (
        <>
          {/* Warm Amber/Gold Headlights */}
          <ellipse cx="14.5" cy="12.5" rx="3.5" ry="2" fill="#FEF08A" />
          <ellipse cx="39.5" cy="12.5" rx="3.5" ry="2" fill="#FEF08A" />
          {/* Subtle headlight ring */}
          <circle cx="14.5" cy="12.5" r="1.5" fill="#FFFFFF" />
          <circle cx="39.5" cy="12.5" r="1.5" fill="#FFFFFF" />
        </>
      ) : (
        <>
          {/* Cool Ice-Blue / White Headlights */}
          <ellipse cx="14.5" cy="12.5" rx="3.5" ry="2" fill="#BAE6FD" />
          <ellipse cx="39.5" cy="12.5" rx="3.5" ry="2" fill="#BAE6FD" />
          <circle cx="14.5" cy="12.5" r="1.5" fill="#FFFFFF" />
          <circle cx="39.5" cy="12.5" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* Forward Headlight Glow Beam when Movable or Active */}
      {isMovable && (
        <>
          <polygon points="12,11 6,0 20,0 16,11" fill={isCopper ? `url(#beam-copper-${uid})` : `url(#beam-cyan-${uid})`} />
          <polygon points="38,11 34,0 48,0 42,11" fill={isCopper ? `url(#beam-copper-${uid})` : `url(#beam-cyan-${uid})`} />
        </>
      )}

      {/* Rear Taillights at the Bottom (Ruby Red LED Lamps) */}
      <rect x="11.5" y="85" width="6.5" height="2" rx="1" fill="#EF4444" />
      <rect x="36" y="85" width="6.5" height="2" rx="1" fill="#EF4444" />
      {/* Taillight center glow bar */}
      <line x1="13" y1="86" x2="16.5" y2="86" stroke="#FCA5A5" strokeWidth="0.8" />
      <line x1="37.5" y1="86" x2="41" y2="86" stroke="#FCA5A5" strokeWidth="0.8" />
    </svg>
  );
}

// Vertical Sculptural Token (Matching Reference Dark Studio Aesthetic)
function VerticalToken({ team, isMovable }) {
  const isCopper = team === 'L';
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
        isCopper
          ? 'bg-gradient-to-b from-[#D97706] to-[#78350F] ring-1 ring-[#F59E0B]/50'
          : 'bg-gradient-to-b from-[#38BDF8] to-[#075985] ring-1 ring-[#7DD3FC]/50'
      } shadow-lg shadow-black/60`}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center bg-black/20 shadow-inner">
        <span className="text-white text-base font-bold drop-shadow">
          {isCopper ? '→' : '←'}
        </span>
      </div>
      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-white/80 mt-1">
        {isCopper ? 'Copper' : 'Cyan'}
      </span>
    </div>
  );
}

// ==========================================
// 4. MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [size, setSize] = useState(2); // default 2v2
  const [board, setBoard] = useState(() => createInitialBoard(2));
  const [view, setView] = useState('game');
  const [history, setHistory] = useState([]);
  const [styleMode, setStyleMode] = useState(() => {
    try {
      return localStorage.getItem('deadlock_style_mode') || 'cars';
    } catch {
      return 'cars';
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('deadlock_sound');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [showRules, setShowRules] = useState(false);
  const [shakingIndex, setShakingIndex] = useState(null);

  // Sync piece style preference
  useEffect(() => {
    try {
      localStorage.setItem('deadlock_style_mode', styleMode);
    } catch {}
  }, [styleMode]);

  // Sync sound preference
  useEffect(() => {
    try {
      localStorage.setItem('deadlock_sound', JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  const targetPar = getPar(size);
  const moves = history.length;
  const movableIndices = getMovableIndices(board);
  const solved = isSolved(board, size);
  const deadlocked = !solved && movableIndices.length === 0;

  // Sound triggers on state changes
  const hasTriggeredDeadlockRef = useRef(false);
  const hasTriggeredSolvedRef = useRef(false);

  useEffect(() => {
    if (deadlocked && !hasTriggeredDeadlockRef.current) {
      if (soundEnabled) sounds.playDeadlock();
      hasTriggeredDeadlockRef.current = true;
    } else if (!deadlocked) {
      hasTriggeredDeadlockRef.current = false;
    }

    if (solved && !hasTriggeredSolvedRef.current) {
      if (soundEnabled) sounds.playVictory();
      hasTriggeredSolvedRef.current = true;
    } else if (!solved) {
      hasTriggeredSolvedRef.current = false;
    }
  }, [deadlocked, solved, soundEnabled]);

  // Handle changing board size
  const handleSizeChange = (newSize) => {
    const parsed = parseInt(newSize, 10);
    if (parsed === size) return;
    setSize(parsed);
    setBoard(createInitialBoard(parsed));
    setHistory([]);
    if (soundEnabled) sounds.playReset();
  };

  // Handle piece click
  const handlePieceClick = (index) => {
    if (solved) return;

    const move = getValidMove(board, index);
    if (!move) {
      if (board[index] !== null) {
        setShakingIndex(index);
        if (soundEnabled) sounds.playInvalid();
        setTimeout(() => setShakingIndex(null), 380);
      }
      return;
    }

    // Play sound
    if (soundEnabled) {
      if (move.type === 'hop') {
        sounds.playHop();
      } else {
        sounds.playSlide();
      }
    }

    // Save history and update board
    setHistory((prev) => [...prev, board]);
    const nextBoard = [...board];
    nextBoard[move.targetIndex] = board[index];
    nextBoard[index] = null;
    setBoard(nextBoard);
  };

  // Undo move
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prevBoard = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setBoard(prevBoard);
    if (soundEnabled) sounds.playUndo();
  }, [history, soundEnabled]);

  // Reset puzzle
  const handleReset = useCallback(() => {
    if (history.length === 0) return;
    setBoard(createInitialBoard(size));
    setHistory([]);
    if (soundEnabled) sounds.playReset();
  }, [size, history.length, soundEnabled]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (view !== 'game') {
        if (e.key === 'Escape') setView('game');
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'z') {
        handleUndo();
      } else if (key === 'r') {
        handleReset();
      } else if (key === 'm') {
        setSoundEnabled((prev) => !prev);
      } else if (key === 'escape') {
        setShowRules(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleReset, view]);

  // Keep page at top when switching between Game and Developed By views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Dynamic slot dimensions based on team size
  const getSlotDimensions = () => {
    if (size <= 3) {
      return 'w-18 h-32 sm:w-22 sm:h-40 md:w-24 md:h-44';
    }
    if (size <= 5) {
      return 'w-14 h-26 sm:w-18 sm:h-34 md:w-20 md:h-38';
    }
    if (size <= 7) {
      return 'w-12 h-22 sm:w-14 sm:h-28 md:w-16 md:h-32';
    }
    // 8v8 - 10v10
    return 'w-10 h-20 sm:w-12 sm:h-24 md:w-14 md:h-28';
  };

  const slotSizeClass = getSlotDimensions();
  const isCarsMode = styleMode === 'cars';

  if (view === 'credits') {
    return <DevelopedBy onBack={() => setView('game')} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none text-[#F3F4F6] relative">
      {/* ================= HEADER / TOP BAR ================= */}
      <header className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 pt-2">
        {/* Left Side: Brand & Controls */}
        <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
          {/* DEADLOCK PUZZLE Header */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              DEADLOCK
            </h1>
            <span className="border border-white/35 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-widest uppercase text-white/90">
              PUZZLE
            </span>
          </div>

          {/* Size Dropdown & Piece Style Side-by-Side */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-8">
            {/* Size Dropdown */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium mb-1.5">
                Track Size
              </span>
              <select
                id="team-size-select"
                value={size}
                onChange={(e) => handleSizeChange(e.target.value)}
                className="custom-select"
                aria-label="Pick team size from 2v2 to 10v10"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}v{n}
                  </option>
                ))}
              </select>
            </div>

            {/* Piece Style Selector */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium mb-1.5">
                Piece Style
              </span>
              <div className="flex items-center gap-5 pt-1">
                {/* Cars option */}
                <button
                  onClick={() => setStyleMode('cars')}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isCarsMode
                        ? 'border-white bg-white'
                        : 'border-gray-500 bg-transparent group-hover:border-gray-400'
                    }`}
                  >
                    {isCarsMode && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z" />
                      <circle cx="7.5" cy="14.5" r="1.5" />
                      <circle cx="16.5" cy="14.5" r="1.5" />
                    </svg>
                    <span>Cars</span>
                  </div>
                </button>

                {/* Tokens option */}
                <button
                  onClick={() => setStyleMode('tokens')}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      !isCarsMode
                        ? 'border-white bg-white'
                        : 'border-gray-500 bg-transparent group-hover:border-gray-400'
                    }`}
                  >
                    {!isCarsMode && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                  <span
                    className={`text-sm font-semibold transition-colors ${
                      !isCarsMode ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                  >
                    Tokens
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: MOVES, PAR, Sound & Help */}
        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-3 self-start sm:self-end md:self-auto">
          {/* Moves Badge */}
          <div className="bg-[#12161E] border border-white/15 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-gray-300 shadow-inner">
            MOVES: {moves}
          </div>

          {/* Par Badge */}
          <div className="border border-white/35 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-white shadow-sm">
            PAR: {targetPar}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={`Sound: ${soundEnabled ? 'Enabled' : 'Muted'} (Press M)`}
            className="icon-pill"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>

          {/* Vertical subtle separator */}
          <div className="w-[1px] h-5 bg-white/20 mx-0.5" />

          {/* Rules/Help Modal Trigger */}
          <button
            onClick={() => setShowRules(true)}
            title="Rules & How to Play"
            className="icon-pill font-bold text-sm"
            aria-label="Rules"
          >
            ?
          </button>
        </div>
      </header>

      {/* ================= MAIN BOARD TRAY ================= */}
      <main className="flex-1 max-w-6xl w-full mx-auto flex flex-col items-center justify-center my-6 sm:my-10">
        {/* Deadlocked Notification Banner */}
        {deadlocked && (
          <div className="w-full max-w-md mb-6 p-4 rounded-2xl bg-[#161B22] border border-amber-500/40 shadow-2xl flex items-center justify-between gap-4 animate-soft-shake">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 ring-1 ring-amber-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Deadlock Reached</h3>
                <p className="text-xs text-gray-400">Zero legal moves remaining</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                className="capsule-btn px-3 py-1 text-xs text-amber-300"
              >
                Undo (Z)
              </button>
              <button
                onClick={handleReset}
                className="capsule-btn px-3 py-1 text-xs"
              >
                Reset (R)
              </button>
            </div>
          </div>
        )}

        {/* Solved Card */}
        {solved && (
          <div className="w-full max-w-md mb-6 p-5 rounded-3xl bg-[#161B22] border border-emerald-500/40 shadow-2xl flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/40">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Puzzle Solved!</h2>
              <p className="text-xs text-gray-300 mt-1">
                Completed in <span className="font-mono font-bold text-emerald-400">{moves}</span> moves
                {moves === targetPar ? ' • Perfect Par achieved!' : ` • Par was ${targetPar}`}
              </p>
            </div>
            <div className="flex items-center gap-2.5 mt-1">
              <button
                onClick={handleReset}
                className="capsule-btn bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-500"
              >
                Play Again
              </button>
              {size < 10 && (
                <button
                  onClick={() => handleSizeChange(size + 1)}
                  className="capsule-btn"
                >
                  Try {size + 1}v{size + 1} →
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3D STUDIO BOARD TRAY (Exact Match to Image) */}
        <div className="w-full studio-tray-outer">
          <div className="w-full studio-tray-inner py-8 sm:py-10 px-4 sm:px-8">
            {/* Dashed Racetrack Border */}
            <div className="racetrack-track" />

            {/* Metallic Track Rivet Grommets along top & bottom loops */}
            <div className="track-stud" style={{ top: '14px', left: '50%' }} />
            <div className="track-stud" style={{ bottom: '14px', left: '35%' }} />
            <div className="track-stud" style={{ bottom: '14px', left: '65%' }} />

            {/* Horizontal Scroll Track for Slots */}
            <div className="w-full overflow-x-auto board-scroll-container py-4 flex justify-center">
              <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4 min-w-max px-3">
                {board.map((piece, index) => {
                  const movable = movableIndices.includes(index);
                  const isShaking = shakingIndex === index;
                  const isEmpty = piece === null;

                  return (
                    <div
                      key={index}
                      className={`${slotSizeClass} bay-slot ${
                        isEmpty ? 'bay-slot-illuminated' : ''
                      } flex items-center justify-center p-1 sm:p-1.5`}
                    >
                      {piece ? (
                        <button
                          onClick={() => handlePieceClick(index)}
                          className={`piece-btn ${movable ? 'movable' : 'immovable'} ${
                            isShaking ? 'animate-soft-shake' : ''
                          }`}
                          aria-label={`${piece === 'L' ? 'Copper' : 'Cyan'} ${
                            isCarsMode ? 'car' : 'token'
                          } at bay ${index + 1}`}
                        >
                          {isCarsMode ? (
                            <VerticalCar
                              team={piece}
                              variantIndex={index}
                              isMovable={movable}
                            />
                          ) : (
                            <VerticalToken team={piece} isMovable={movable} />
                          )}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Undo and Reset Capsule Buttons (Matching image) */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="capsule-btn px-8 py-2.5"
            title="Undo last move (Z)"
          >
            Undo (Z)
          </button>

          <button
            onClick={handleReset}
            disabled={history.length === 0}
            className="capsule-btn px-8 py-2.5"
            title="Reset puzzle to start (R)"
          >
            Reset (R)
          </button>
        </div>
      </main>

      {/* ================= MINIMAL FOOTER ================= */}
      <footer className="w-full max-w-6xl mx-auto mt-auto pt-5 pb-1 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-[11px] sm:text-xs font-medium text-gray-500">
          DEADLOCK · developed with love, just for fun
        </p>
        <button
          onClick={() => setView('credits')}
          className="capsule-btn px-4 py-1.5 text-xs"
          title="About the developer"
        >
          Developed By
        </button>
      </footer>

      {/* ================= RULES MODAL ================= */}
      {showRules && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowRules(false)}
        >
          <div
            className="w-full max-w-md bg-[#161B22] border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Rules of Deadlock
              </h2>
              <button
                onClick={() => setShowRules(false)}
                className="icon-pill text-xs"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1F2633] border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <p>
                  <strong className="text-white">Strict Direction:</strong> Left (Copper) pieces move only <em>right</em>. Right (Cyan) pieces move only <em>left</em>. Pieces can never move backwards.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1F2633] border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <p>
                  <strong className="text-white">Slide:</strong> Move 1 space forward into an immediately adjacent empty slot.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1F2633] border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <p>
                  <strong className="text-white">Hop:</strong> Leap over exactly one piece of either team into an empty slot 2 spaces ahead.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1F2633] border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <p>
                  <strong className="text-white">Objective:</strong> Swap both teams completely to opposite sides. Avoid reaching a <em>deadlock</em> where no piece has a legal move!
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowRules(false)}
                className="capsule-btn bg-white text-gray-900 border-none hover:bg-gray-200"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
