// src/components/Game/Piano.jsx - Complete rewrite with fixed music notation
import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAudio } from '../../contexts/AudioContext';
import { useGame } from '../../contexts/GameContext';

// Extended piano layout với 3 octaves (36 keys total)
const PIANO_LAYOUT = [
  // Octave 3
  { note: 'C3', key: 'Q', isBlack: false, position: 0, octave: 3 },
  { note: 'D3', key: 'W', isBlack: false, position: 1, octave: 3 },
  { note: 'E3', key: 'E', isBlack: false, position: 2, octave: 3 },
  { note: 'F3', key: 'R', isBlack: false, position: 3, octave: 3 },
  { note: 'G3', key: 'T', isBlack: false, position: 4, octave: 3 },
  { note: 'A3', key: 'Y', isBlack: false, position: 5, octave: 3 },
  { note: 'B3', key: 'U', isBlack: false, position: 6, octave: 3 },
  
  // Octave 4
  { note: 'C4', key: 'A', isBlack: false, position: 7, octave: 4 },
  { note: 'D4', key: 'S', isBlack: false, position: 8, octave: 4 },
  { note: 'E4', key: 'D', isBlack: false, position: 9, octave: 4 },
  { note: 'F4', key: 'F', isBlack: false, position: 10, octave: 4 },
  { note: 'G4', key: 'G', isBlack: false, position: 11, octave: 4 },
  { note: 'A4', key: 'H', isBlack: false, position: 12, octave: 4 },
  { note: 'B4', key: 'J', isBlack: false, position: 13, octave: 4 },
  
  // Octave 5
  { note: 'C5', key: 'Z', isBlack: false, position: 14, octave: 5 },
  { note: 'D5', key: 'X', isBlack: false, position: 15, octave: 5 },
  { note: 'E5', key: 'C', isBlack: false, position: 16, octave: 5 },
  { note: 'F5', key: 'V', isBlack: false, position: 17, octave: 5 },
  { note: 'G5', key: 'B', isBlack: false, position: 18, octave: 5 },
  { note: 'A5', key: 'N', isBlack: false, position: 19, octave: 5 },
  { note: 'B5', key: 'M', isBlack: false, position: 20, octave: 5 }
];

// Black keys positioned between white keys
const BLACK_KEYS = [
  // Octave 3
  { note: 'C#3', key: '1', positionBetween: [0, 1], octave: 3 },
  { note: 'D#3', key: '2', positionBetween: [1, 2], octave: 3 },
  { note: 'F#3', key: '3', positionBetween: [3, 4], octave: 3 },
  { note: 'G#3', key: '4', positionBetween: [4, 5], octave: 3 },
  { note: 'A#3', key: '5', positionBetween: [5, 6], octave: 3 },
  
  // Octave 4
  { note: 'C#4', key: '6', positionBetween: [7, 8], octave: 4 },
  { note: 'D#4', key: '7', positionBetween: [8, 9], octave: 4 },
  { note: 'F#4', key: '8', positionBetween: [10, 11], octave: 4 },
  { note: 'G#4', key: '9', positionBetween: [11, 12], octave: 4 },
  { note: 'A#4', key: '0', positionBetween: [12, 13], octave: 4 },
  
  // Octave 5
  { note: 'C#5', key: 'I', positionBetween: [14, 15], octave: 5 },
  { note: 'D#5', key: 'O', positionBetween: [15, 16], octave: 5 },
  { note: 'F#5', key: 'P', positionBetween: [17, 18], octave: 5 },
  { note: 'G#5', key: 'K', positionBetween: [18, 19], octave: 5 },
  { note: 'A#5', key: 'L', positionBetween: [19, 20], octave: 5 }
];

const NOTE_FREQUENCIES = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
  'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00,
  'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
  'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
  'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00,
  'A#5': 932.33, 'B5': 987.77
};

// Music notation component - Fixed để hiển thị đúng trên staff lines
const MusicNotation = ({ activeNotes = [], showNotation = true }) => {
  const [movingNotes, setMovingNotes] = useState([]);
  const notationRef = useRef(null);

  // Tạo note mới khi có activeNotes thay đổi
  useEffect(() => {
    if (!showNotation || activeNotes.length === 0) return;

    const latestNote = activeNotes[activeNotes.length - 1];
    if (!latestNote) return;

    const newNote = {
      id: Date.now() + Math.random(),
      note: latestNote,
      startTime: Date.now(),
      staffPosition: getStaffPosition(latestNote),
      color: getOctaveColor(latestNote)
    };

    setMovingNotes(prev => [...prev.slice(-15), newNote]); // Giữ tối đa 15 notes
  }, [activeNotes, showNotation]);

  // Cleanup old notes
  useEffect(() => {
    if (!showNotation) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      setMovingNotes(prev => prev.filter(note => now - note.startTime < 8000));
    }, 1000);

    return () => clearInterval(interval);
  }, [showNotation]);

  const getStaffPosition = (note) => {
    // Tính toán vị trí chính xác trên staff lines (từ top của container)
    const notePositions = {
      // Octave 5 - Treble staff (cao)
      'C5': 32,  'C#5': 30,
      'D5': 28,  'D#5': 26,
      'E5': 24,  
      'F5': 20,  'F#5': 18,
      'G5': 16,  'G#5': 14,
      'A5': 12,  'A#5': 10,
      'B5': 8,   
      
      // Octave 4 - Giữa treble và bass
      'C4': 40,  'C#4': 42,
      'D4': 44,  'D#4': 46,
      'E4': 48,  
      'F4': 52,  'F#4': 54,
      'G4': 56,  'G#4': 58,
      'A4': 60,  'A#4': 62,
      'B4': 64,  
      
      // Octave 3 - Bass staff (thấp)
      'C3': 68,  'C#3': 70,
      'D3': 72,  'D#3': 74,
      'E3': 76,  
      'F3': 80,  'F#3': 82,
      'G3': 84,  'G#3': 86,
      'A3': 88,  'A#3': 90,
      'B3': 92   
    };
    
    return notePositions[note] || 50; // Default position
  };

  const getOctaveColor = (note) => {
    if (note.includes('3')) return '#ef4444'; // Red cho octave 3
    if (note.includes('4')) return '#3b82f6'; // Blue cho octave 4  
    if (note.includes('5')) return '#10b981'; // Green cho octave 5
    return '#8b5cf6'; // Purple cho khác
  };

  if (!showNotation) return null;

  return (
    <div className="music-notation relative w-full h-40 bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-transparent overflow-hidden border border-blue-500/30 rounded-lg">
      <div ref={notationRef} className="relative w-full h-full">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20"></div>
        
        {/* Treble staff lines */}
        <div className="absolute top-0 left-0 right-0">
          {[8, 16, 24, 32, 40].map((y, index) => (
            <div
              key={`treble-${index}`}
              className="absolute w-full h-px bg-gray-400/60"
              style={{ top: `${y}px` }}
            />
          ))}
          {/* Treble clef */}
          <div className="absolute left-6 top-0 text-2xl text-gray-300 font-serif leading-none">
            𝄞
          </div>
        </div>

        {/* Bass staff lines */}
        <div className="absolute top-0 left-0 right-0">
          {[48, 56, 64, 72, 80].map((y, index) => (
            <div
              key={`bass-${index}`}
              className="absolute w-full h-px bg-gray-400/60"
              style={{ top: `${y}px` }}
            />
          ))}
          {/* Bass clef */}
          <div className="absolute left-6 top-12 text-2xl text-gray-300 font-serif leading-none">
            𝄢
          </div>
        </div>

        {/* Bar lines */}
        {[25, 50, 75].map((x, index) => (
          <div
            key={`bar-${index}`}
            className="absolute h-full w-px bg-gray-500/50"
            style={{ left: `${x}%` }}
          />
        ))}

        {/* Target line - nơi nốt sẽ được "hit" */}
        <div className="absolute right-24 top-0 bottom-0 w-1 bg-yellow-400 opacity-80 z-10">
          <div className="absolute -top-1 -left-2 w-5 h-3 bg-yellow-400 rounded-t-sm"></div>
          <div className="absolute -bottom-1 -left-2 w-5 h-3 bg-yellow-400 rounded-b-sm"></div>
        </div>

        {/* Moving notes - Chạy từ TRÁI sang PHẢI đến target line */}
        <AnimatePresence>
          {movingNotes.map(note => (
            <motion.div
              key={note.id}
              initial={{ 
                x: '60px',  // Bắt đầu từ sau clef
                scale: 0, 
                opacity: 0 
              }}
              animate={{ 
                x: 'calc(100vw - 180px)', // Chạy đến target line bên phải
                scale: 1,
                opacity: 1
              }}
              exit={{ 
                opacity: 0, 
                scale: 0 
              }}
              transition={{ 
                x: { duration: 6, ease: 'linear' },
                scale: { duration: 0.3 },
                opacity: { duration: 0.3 }
              }}
              className="absolute w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-20"
              style={{ 
                backgroundColor: note.color,
                top: `${note.staffPosition}px`,
                transform: 'translateY(-50%)', // Center vertically on staff line
                boxShadow: `0 0 12px ${note.color}80, inset 0 1px 2px rgba(255,255,255,0.3)`
              }}
            >
              ♪
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Time signatures */}
        <div className="absolute left-32 top-1 text-gray-300 text-xs font-mono">
          <div className="text-center leading-3">
            <div>4</div>
            <div>4</div>
          </div>
        </div>
        <div className="absolute left-32 top-12 text-gray-300 text-xs font-mono">
          <div className="text-center leading-3">
            <div>4</div>
            <div>4</div>
          </div>
        </div>

        {/* Key signature */}
        <div className="absolute left-40 top-1 text-gray-400 text-xs">
          C Major
        </div>
      </div>
    </div>
  );
};

// White Piano Key Component
const WhitePianoKey = ({ 
  keyData, 
  isPressed = false, 
  onPress, 
  onRelease, 
  disabled = false 
}) => {
  const [localPressed, setLocalPressed] = useState(false);

  useEffect(() => {
    if (isPressed && !localPressed) {
      setLocalPressed(true);
      setTimeout(() => setLocalPressed(false), 150);
    }
  }, [isPressed, localPressed]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    if (!disabled) onPress(keyData.note);
  }, [keyData.note, onPress, disabled]);

  const handleMouseUp = useCallback((e) => {
    e.preventDefault();
    if (!disabled) onRelease(keyData.note);
  }, [keyData.note, onRelease, disabled]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (!disabled) onPress(keyData.note);
  }, [keyData.note, onPress, disabled]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (!disabled) onRelease(keyData.note);
  }, [keyData.note, onRelease, disabled]);

  const getOctaveColor = () => {
    switch (keyData.octave) {
      case 3: return 'from-red-100 to-red-50';
      case 4: return 'from-blue-100 to-blue-50';
      case 5: return 'from-green-100 to-green-50';
      default: return 'from-gray-100 to-white';
    }
  };

  const getPressedColor = () => {
    switch (keyData.octave) {
      case 3: return 'from-red-500 to-red-600';
      case 4: return 'from-blue-500 to-blue-600';
      case 5: return 'from-green-500 to-green-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  return (
    <motion.div
      className={clsx(
        'relative select-none cursor-pointer transition-all duration-100 border-r border-gray-300 last:border-r-0',
        'flex-1 h-24 rounded-b-lg overflow-hidden shadow-md',
        {
          [`bg-gradient-to-b ${getPressedColor()} text-white`]: isPressed || localPressed,
          [`bg-gradient-to-b ${getOctaveColor()}`]: !(isPressed || localPressed),
          'opacity-50 cursor-not-allowed': disabled
        }
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={{
        y: isPressed || localPressed ? 2 : 0,
        scale: isPressed || localPressed ? 0.98 : 1
      }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      whileHover={!disabled ? { y: 1 } : {}}
    >
      {/* Key Label */}
      <div className={clsx(
        'absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold',
        isPressed || localPressed ? 'text-white' : 'text-gray-700'
      )}>
        {keyData.key}
      </div>

      {/* Note Label */}
      <div className={clsx(
        'absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-mono',
        isPressed || localPressed ? 'text-white/80' : 'text-gray-500'
      )}>
        {keyData.note}
      </div>

      {/* Octave indicator */}
      <div className={clsx(
        'absolute top-1 right-1 w-2 h-2 rounded-full',
        keyData.octave === 3 && 'bg-red-400',
        keyData.octave === 4 && 'bg-blue-400',
        keyData.octave === 5 && 'bg-green-400'
      )} />

      {/* Press Effect */}
      <AnimatePresence>
        {(isPressed || localPressed) && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white rounded-lg pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Black Piano Key Component
const BlackPianoKey = ({ 
  keyData, 
  isPressed = false, 
  onPress, 
  onRelease, 
  disabled = false,
  leftPosition 
}) => {
  const [localPressed, setLocalPressed] = useState(false);

  useEffect(() => {
    if (isPressed && !localPressed) {
      setLocalPressed(true);
      setTimeout(() => setLocalPressed(false), 150);
    }
  }, [isPressed, localPressed]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) onPress(keyData.note);
  }, [keyData.note, onPress, disabled]);

  const handleMouseUp = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) onRelease(keyData.note);
  }, [keyData.note, onRelease, disabled]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) onPress(keyData.note);
  }, [keyData.note, onPress, disabled]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) onRelease(keyData.note);
  }, [keyData.note, onRelease, disabled]);

  const getPressedColor = () => {
    switch (keyData.octave) {
      case 3: return 'from-red-600 to-red-700';
      case 4: return 'from-blue-600 to-blue-700';
      case 5: return 'from-green-600 to-green-700';
      default: return 'from-purple-600 to-purple-700';
    }
  };

  return (
    <motion.div
      className={clsx(
        'absolute select-none cursor-pointer transition-all duration-100 z-10',
        'w-6 h-16 rounded-b-md overflow-hidden shadow-lg',
        {
          [`bg-gradient-to-b ${getPressedColor()}`]: isPressed || localPressed,
          'bg-gradient-to-b from-gray-900 to-gray-800': !(isPressed || localPressed),
          'opacity-50 cursor-not-allowed': disabled
        }
      )}
      style={{
        left: `${leftPosition}%`,
        marginLeft: '-0.75rem'
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={{
        y: isPressed || localPressed ? 1 : 0,
        scale: isPressed || localPressed ? 0.95 : 1
      }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      whileHover={!disabled ? { y: 0.5 } : {}}
    >
      {/* Key Label */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-300">
        {keyData.key}
      </div>

      {/* Note Label */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-400">
        {keyData.note}
      </div>

      {/* Octave indicator */}
      <div className={clsx(
        'absolute top-1 right-0.5 w-1.5 h-1.5 rounded-full',
        keyData.octave === 3 && 'bg-red-400',
        keyData.octave === 4 && 'bg-blue-400',
        keyData.octave === 5 && 'bg-green-400'
      )} />
    </motion.div>
  );
};

// Main Piano Component
const Piano = ({ 
  onKeyPress, 
  onKeyRelease, 
  pressedKeys = new Set(),
  disabled = false,
  className = '',
  showNotation = true
}) => {
  const pianoRef = useRef(null);
  const { playNote, stopNote } = useAudio();
  const { gameSettings } = useGame();
  const [recentNotes, setRecentNotes] = useState([]);
  
  // Combine all keys for keyboard mapping
  const allKeys = useMemo(() => {
    const keys = {};
    PIANO_LAYOUT.forEach(key => {
      keys[key.key] = key.note;
    });
    BLACK_KEYS.forEach(key => {
      keys[key.key] = key.note;
    });
    return keys;
  }, []);

  // Key press handlers
  const handleKeyPress = useCallback(async (note) => {
    if (disabled) return;
    
    // Add to recent notes for notation display
    setRecentNotes(prev => {
      const newNotes = [...prev, note];
      return newNotes.slice(-10); // Keep only last 10 notes
    });
    
    // Play audio
    if (gameSettings?.soundEnabled) {
      await playNote(note);
    }
    
    // Trigger callback
    if (onKeyPress) {
      onKeyPress(note);
    }
  }, [disabled, gameSettings?.soundEnabled, playNote, onKeyPress]);

  const handleKeyRelease = useCallback((note) => {
    if (disabled) return;
    
    // Stop audio
    if (gameSettings?.soundEnabled) {
      stopNote(note);
    }
    
    // Trigger callback
    if (onKeyRelease) {
      onKeyRelease(note);
    }
  }, [disabled, gameSettings?.soundEnabled, stopNote, onKeyRelease]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled || e.repeat) return;
      
      const note = allKeys[e.key.toUpperCase()];
      if (note && !pressedKeys.has(note)) {
        handleKeyPress(note);
      }
    };

    const handleKeyUp = (e) => {
      if (disabled) return;
      
      const note = allKeys[e.key.toUpperCase()];
      if (note) {
        handleKeyRelease(note);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, pressedKeys, handleKeyPress, handleKeyRelease, allKeys]);

  // Calculate black key positions
  const getBlackKeyPosition = (positionBetween) => {
    const [leftPos, rightPos] = positionBetween;
    const whiteKeyWidth = 100 / PIANO_LAYOUT.length;
    return (leftPos + 0.5 + rightPos + 0.5) * whiteKeyWidth / 2;
  };

  return (
    <div className={clsx('piano-container relative max-w-7xl mx-auto', className)}>
      {/* Music Notation Display */}
      {showNotation && (
        <MusicNotation 
          activeNotes={recentNotes}
          showNotation={showNotation}
        />
      )}

      {/* Piano Frame */}
      <div className="piano-frame bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-xl shadow-2xl mt-4">
        {/* Piano Brand/Logo */}
        <div className="text-center mb-4">
          <h3 className="text-white font-display text-lg font-bold tracking-wider">
            BIGCOIN PIANO
          </h3>
          <div className="flex justify-center space-x-2 mt-2">
            <div className="w-3 h-1 bg-red-400 rounded"></div>
            <div className="w-3 h-1 bg-blue-400 rounded"></div>
            <div className="w-3 h-1 bg-green-400 rounded"></div>
          </div>
        </div>
        
        {/* Piano Keyboard */}
        <div 
          ref={pianoRef}
          className="piano-keyboard relative bg-black p-2 rounded-lg shadow-inner"
          style={{ height: '120px' }}
        >
          {/* White Keys Container */}
          <div className="absolute inset-2 flex gap-px">
            {PIANO_LAYOUT.map((keyData) => (
              <WhitePianoKey
                key={keyData.note}
                keyData={keyData}
                isPressed={pressedKeys.has(keyData.note)}
                onPress={handleKeyPress}
                onRelease={handleKeyRelease}
                disabled={disabled}
              />
            ))}
          </div>
          
          {/* Black Keys Container */}
          <div className="absolute inset-2">
            {BLACK_KEYS.map((keyData) => (
              <BlackPianoKey
                key={keyData.note}
                keyData={keyData}
                isPressed={pressedKeys.has(keyData.note)}
                onPress={handleKeyPress}
                onRelease={handleKeyRelease}
                disabled={disabled}
                leftPosition={getBlackKeyPosition(keyData.positionBetween)}
              />
            ))}
          </div>
        </div>
        
        {/* Piano Controls */}
        <div className="flex justify-between items-center mt-4 px-2 text-xs">
          {/* Octave Legend */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-400">Octave 3</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-400">Octave 4</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-400">Octave 5</span>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">
              {disabled ? 'DISABLED' : 'READY'}
            </span>
            <div className={clsx(
              'w-2 h-2 rounded-full',
              disabled ? 'bg-red-400' : 'bg-green-400 animate-pulse'
            )}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Performance optimized piano for game mode
export const GamePiano = React.memo(({ 
  onKeystroke,
  gameState,
  showGuide = false,
  showNotation = true
}) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [activeNotes, setActiveNotes] = useState([]);
  const { isGameActive, processKeystroke } = useGame();
  
  const handleKeyPress = useCallback(async (note) => {
    if (!isGameActive()) return;

    const timestamp = Date.now();
    const keystrokeData = {
      key: note,
      timestamp: timestamp,
      points: 10,
      accuracy: 'good',
      combo: 1
    };
    
    setPressedKeys(prev => new Set([...prev, note]));
    
    // Add note để hiển thị trên notation
    setActiveNotes(prev => [...prev, note]);
    
    if (processKeystroke) {
      await processKeystroke(keystrokeData);
    }
    
    if (onKeystroke) {
      onKeystroke(keystrokeData);
    }
    
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 150);
  }, [isGameActive, processKeystroke, onKeystroke]);

  const handleKeyRelease = useCallback((note) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, []);

  return (
    <div className="game-piano-container relative">
      <Piano
        onKeyPress={handleKeyPress}
        onKeyRelease={handleKeyRelease}
        pressedKeys={pressedKeys}
        disabled={!isGameActive()}
        className="game-piano"
        showNotation={showNotation}
      />
    </div>
  );
});

GamePiano.displayName = 'GamePiano';

export default Piano;