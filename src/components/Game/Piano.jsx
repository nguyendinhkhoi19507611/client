// src/components/Game/Piano.jsx - Fixed piano layout with proper black key positioning
import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAudio } from '../../contexts/AudioContext';
import { useGame } from '../../contexts/GameContext';

// Correct piano layout with proper black key positioning
const PIANO_LAYOUT = [
  // White keys with their positions and corresponding black keys
  { note: 'C4', key: 'A', isBlack: false, position: 0, hasBlackKeyAfter: true },
  { note: 'D4', key: 'S', isBlack: false, position: 1, hasBlackKeyAfter: true },
  { note: 'E4', key: 'D', isBlack: false, position: 2, hasBlackKeyAfter: false },
  { note: 'F4', key: 'F', isBlack: false, position: 3, hasBlackKeyAfter: true },
  { note: 'G4', key: 'G', isBlack: false, position: 4, hasBlackKeyAfter: true },
  { note: 'A4', key: 'H', isBlack: false, position: 5, hasBlackKeyAfter: true },
  { note: 'B4', key: 'J', isBlack: false, position: 6, hasBlackKeyAfter: false },
  { note: 'C5', key: 'K', isBlack: false, position: 7, hasBlackKeyAfter: true },
  { note: 'D5', key: 'L', isBlack: false, position: 8, hasBlackKeyAfter: false },
];

// Black keys with their positions relative to white keys
const BLACK_KEYS = [
  { note: 'C#4', key: 'W', isBlack: true, positionBetween: [0, 1] }, // Between C4 and D4
  { note: 'D#4', key: 'E', isBlack: true, positionBetween: [1, 2] }, // Between D4 and E4
  { note: 'F#4', key: 'T', isBlack: true, positionBetween: [3, 4] }, // Between F4 and G4
  { note: 'G#4', key: 'Y', isBlack: true, positionBetween: [4, 5] }, // Between G4 and A4
  { note: 'A#4', key: 'U', isBlack: true, positionBetween: [5, 6] }, // Between A4 and B4
  { note: 'C#5', key: 'O', isBlack: true, positionBetween: [7, 8] }, // Between C5 and D5
];

const NOTE_FREQUENCIES = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
  'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33
};

// White Piano Key Component
const WhitePianoKey = ({ 
  keyData, 
  isPressed = false, 
  onPress, 
  onRelease, 
  disabled = false,
  position 
}) => {
  const keyRef = useRef(null);
  const [localPressed, setLocalPressed] = useState(false);
  const [pressIntensity, setPressIntensity] = useState(0);

  useEffect(() => {
    if (isPressed && !localPressed) {
      setLocalPressed(true);
      setPressIntensity(1);
      setTimeout(() => {
        setLocalPressed(false);
        setPressIntensity(0);
      }, 150);
    }
  }, [isPressed, localPressed]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      onPress(keyData.note);
    }
  }, [keyData.note, onPress, disabled]);

  const handleMouseUp = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      onRelease(keyData.note);
    }
  }, [keyData.note, onRelease, disabled]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      onPress(keyData.note);
    }
  }, [keyData.note, onPress, disabled]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      onRelease(keyData.note);
    }
  }, [keyData.note, onRelease, disabled]);

  return (
    <motion.div
      ref={keyRef}
      className={clsx(
        'relative select-none cursor-pointer transition-all duration-100 border-r border-gray-300 last:border-r-0',
        'flex-1 h-32 bg-white hover:bg-gray-50 rounded-b-lg overflow-hidden',
        {
          'bg-blue-500 text-white': isPressed || localPressed,
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
        boxShadow: isPressed || localPressed ? 
          'inset 0 3px 8px rgba(0,0,0,0.3)' : 
          '0 2px 4px rgba(0,0,0,0.1)'
      }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
    >
      {/* Key Label */}
      <div className={clsx(
        'absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold pointer-events-none',
        isPressed || localPressed ? 'text-white' : 'text-gray-700'
      )}>
        {keyData.key}
      </div>

      {/* Note Label */}
      <div className={clsx(
        'absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono pointer-events-none',
        isPressed || localPressed ? 'text-blue-100' : 'text-gray-500'
      )}>
        {keyData.note}
      </div>

      {/* Press Effect with Light */}
      <AnimatePresence>
        {(isPressed || localPressed) && (
          <>
            {/* Ripple Effect */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-white rounded-full pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            
            {/* Glow Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, rgb(59, 130, 246) 0%, transparent 70%)`,
                filter: 'blur(4px)'
              }}
            />
            
            {/* Sparkle Effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: (i - 1) * 20,
                  y: 20
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [-10, -30],
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1
                }}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${30 + (i * 20)}%`,
                  filter: 'blur(1px)'
                }}
              />
            ))}
          </>
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
  const keyRef = useRef(null);
  const [localPressed, setLocalPressed] = useState(false);
  const [pressIntensity, setPressIntensity] = useState(0);

  useEffect(() => {
    if (isPressed && !localPressed) {
      setLocalPressed(true);
      setPressIntensity(1);
      setTimeout(() => {
        setLocalPressed(false);
        setPressIntensity(0);
      }, 150);
    }
  }, [isPressed, localPressed]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onPress(keyData.note);
    }
  }, [keyData.note, onPress, disabled]);

  const handleMouseUp = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onRelease(keyData.note);
    }
  }, [keyData.note, onRelease, disabled]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onPress(keyData.note);
    }
  }, [keyData.note, onPress, disabled]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onRelease(keyData.note);
    }
  }, [keyData.note, onRelease, disabled]);

  return (
    <motion.div
      ref={keyRef}
      className={clsx(
        'absolute select-none cursor-pointer transition-all duration-100 z-10',
        'w-8 h-20 bg-gray-900 hover:bg-gray-800 rounded-b-md overflow-hidden',
        {
          'bg-blue-600': isPressed || localPressed,
          'opacity-50 cursor-not-allowed': disabled
        }
      )}
      style={{
        left: `${leftPosition}%`,
        marginLeft: '-1rem'
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={{
        y: isPressed || localPressed ? 2 : 0,
        boxShadow: isPressed || localPressed ? 
          'inset 0 2px 6px rgba(0,0,0,0.4)' : 
          '0 1px 3px rgba(0,0,0,0.2)'
      }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
    >
      {/* Key Label */}
      <div className={clsx(
        'absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold pointer-events-none',
        'text-gray-300'
      )}>
        {keyData.key}
      </div>

      {/* Note Label */}
      <div className={clsx(
        'absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono pointer-events-none',
        'text-gray-400'
      )}>
        {keyData.note}
      </div>

      {/* Press Effect with Light */}
      <AnimatePresence>
        {(isPressed || localPressed) && (
          <>
            {/* Glow Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, rgb(37, 99, 235) 0%, transparent 80%)`,
                filter: 'blur(3px)'
              }}
            />
            
            {/* Sparkle Effect */}
            <motion.div
              initial={{ 
                opacity: 0,
                scale: 0,
                y: 10
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-5, -15],
              }}
              transition={{ duration: 0.4 }}
              className="absolute w-2 h-2 left-1/2 -translate-x-1/2 bg-blue-200 rounded-full"
              style={{
                filter: 'blur(1px)'
              }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Piano Component
const Piano = ({ 
  onKeyPress, 
  onKeyRelease, 
  pressedKeys = new Set(),
  disabled = false,
  className = ''
}) => {
  const pianoRef = useRef(null);
  const { playNote, stopNote } = useAudio();
  const { gameSettings } = useGame();
  
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
    const whiteKeyWidth = 100 / PIANO_LAYOUT.length; // Percentage width of each white key
    return (leftPos + 0.5 + rightPos + 0.5) * whiteKeyWidth / 2;
  };

  return (
    <div className={clsx('piano-container relative max-w-5xl mx-auto', className)}>
      {/* Piano Frame */}
      <div className="piano-frame bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl">
        {/* Piano Brand/Logo */}
        <div className="text-center mb-6">
          <h3 className="text-white font-display text-xl font-bold tracking-wider">
            BIGCOIN PIANO
          </h3>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-2 rounded"></div>
        </div>
        
        {/* Piano Keyboard */}
        <div 
          ref={pianoRef}
          className="piano-keyboard relative bg-black p-3 rounded-lg shadow-inner"
          style={{ height: '180px' }}
        >
          {/* White Keys Container */}
          <div className="absolute inset-3 flex">
            {PIANO_LAYOUT.map((keyData) => (
              <WhitePianoKey
                key={keyData.note}
                keyData={keyData}
                isPressed={pressedKeys.has(keyData.note)}
                onPress={handleKeyPress}
                onRelease={handleKeyRelease}
                disabled={disabled}
                position={keyData.position}
              />
            ))}
          </div>
          
          {/* Black Keys Container */}
          <div className="absolute inset-3">
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
          
          {/* Piano Lid Reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg pointer-events-none"></div>
        </div>
        
        {/* Piano Controls */}
        <div className="flex justify-between items-center mt-6 px-2">
          {/* Volume Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">AUDIO</span>
          </div>
          
          {/* Key Guide */}
          <div className="text-xs text-gray-400 text-center">
            <div>Use keyboard keys A-L to play piano</div>
            <div>Press keys to earn points!</div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {disabled ? 'DISABLED' : 'READY'}
            </span>
            <div className={clsx(
              'w-2 h-2 rounded-full',
              disabled ? 'bg-red-400' : 'bg-green-400 animate-pulse'
            )}></div>
          </div>
        </div>
      </div>
      
      {/* Piano Shadow */}
      <div className="piano-shadow absolute -bottom-2 left-4 right-4 h-4 bg-black/20 rounded-full blur-sm"></div>
    </div>
  );
};

// Performance optimized piano for game mode with continuous scoring
export const GamePiano = React.memo(({ 
  onKeystroke,
  gameState,
  showGuide = false 
}) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const { isGameActive, processKeystroke } = useGame();
  
  // Handle key press with continuous scoring
  const handleKeyPress = useCallback(async (note) => {
    if (!isGameActive()) return;

    const timestamp = Date.now();
    
    // Create keystroke data with points
    const keystrokeData = {
      key: note,
      timestamp: timestamp,
      points: 10, // Base points per key press
      accuracy: 'good', // Default accuracy
      combo: 1
    };
    
    // Update local pressed state
    setPressedKeys(prev => new Set([...prev, note]));
    
    // Process the keystroke through game context (this will update score continuously)
    if (processKeystroke) {
      await processKeystroke(keystrokeData);
    }
    
    // Also call the parent callback if provided
    if (onKeystroke) {
      onKeystroke(keystrokeData);
    }
    
    // Clear pressed state after animation
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 150);
  }, [isGameActive, processKeystroke, onKeystroke]);

  const handleKeyRelease = useCallback((note) => {
    // Key release doesn't affect scoring, just visual feedback
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, []);

  return (
    <div className="game-piano-container">
      <Piano
        onKeyPress={handleKeyPress}
        onKeyRelease={handleKeyRelease}
        pressedKeys={pressedKeys}
        disabled={!isGameActive()}
        className="game-piano"
      />
      
      {/* Key Guide */}
      {showGuide && (
        <div className="mt-4 text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 inline-block">
            <h4 className="text-white font-medium mb-2">Piano Keys Guide</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-400 mb-1">White Keys</div>
                <div className="text-gray-300">A S D F G H J K L</div>
              </div>
              <div>
                <div className="font-medium text-gray-400 mb-1">Black Keys</div>
                <div className="text-gray-300">W E T Y U O</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Each key press earns you 10 points!
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

GamePiano.displayName = 'GamePiano';

export default Piano;