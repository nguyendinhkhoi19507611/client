// client/src/components/Game/Piano.jsx - Interactive piano keyboard component
import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAudio } from '../../contexts/AudioContext';
import { useGame } from '../../contexts/GameContext';

// Simplified piano keys with keyboard mappings
const PIANO_KEYS = [
  { note: 'C4', key: 'A', isBlack: false },
  { note: 'C#4', key: 'W', isBlack: true },
  { note: 'D4', key: 'S', isBlack: false },
  { note: 'D#4', key: 'E', isBlack: true },
  { note: 'E4', key: 'D', isBlack: false },
  { note: 'F4', key: 'F', isBlack: false },
  { note: 'F#4', key: 'T', isBlack: true },
  { note: 'G4', key: 'G', isBlack: false },
  { note: 'G#4', key: 'Y', isBlack: true },
  { note: 'A4', key: 'H', isBlack: false },
  { note: 'A#4', key: 'U', isBlack: true },
  { note: 'B4', key: 'J', isBlack: false },
  { note: 'C5', key: 'K', isBlack: false },
  { note: 'C#5', key: 'O', isBlack: true },
  { note: 'D5', key: 'L', isBlack: false }
];

const NOTE_FREQUENCIES = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
  'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33
};

// Piano Key Component
const PianoKey = ({ 
  keyData,
  isPressed = false, 
  onPress, 
  onRelease,
  disabled = false
}) => {
  const keyRef = useRef(null);
  const [localPressed, setLocalPressed] = useState(false);

  // Handle key press animation
  useEffect(() => {
    if (isPressed && !localPressed) {
      setLocalPressed(true);
      setTimeout(() => setLocalPressed(false), 150);
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

  const keyClasses = clsx(
    'relative select-none cursor-pointer transition-all duration-100 border',
    {
      // White keys
      'h-32 bg-white hover:bg-gray-100 border-gray-300 rounded-b-lg shadow-md': !keyData.isBlack && !isPressed && !localPressed,
      'h-32 bg-blue-500 border-blue-600 shadow-lg': !keyData.isBlack && (isPressed || localPressed),
      
      // Black keys
      'h-20 w-8 bg-gray-900 hover:bg-gray-800 border-gray-700 rounded-b-md shadow-lg absolute z-10': keyData.isBlack && !isPressed && !localPressed,
      'h-20 w-8 bg-blue-600 border-blue-700 shadow-xl absolute z-10': keyData.isBlack && (isPressed || localPressed),
      
      // Disabled state
      'opacity-50 cursor-not-allowed': disabled
    }
  );

  return (
    <motion.div
      ref={keyRef}
      className={keyClasses}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={{
        scale: isPressed || localPressed ? 0.98 : 1,
        y: isPressed || localPressed ? (keyData.isBlack ? 1 : 2) : 0
      }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
    >
      {/* Key Label - Always show */}
      <div className={clsx(
        'absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold pointer-events-none',
        keyData.isBlack ? 'text-white' : 'text-gray-700'
      )}>
        {keyData.key}
      </div>

      {/* Note Label */}
      <div className={clsx(
        'absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono pointer-events-none',
        keyData.isBlack ? 'text-gray-300' : 'text-gray-500'
      )}>
        {keyData.note}
      </div>

      {/* Glow effect for active keys */}
      {(isPressed || localPressed) && (
        <div className={clsx(
          'absolute inset-0 rounded pointer-events-none',
          keyData.isBlack ? 'shadow-lg shadow-blue-500/50' : 'shadow-lg shadow-blue-400/50'
        )} />
      )}
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
    const keyMap = {};
    PIANO_KEYS.forEach(keyData => {
      keyMap[`Key${keyData.key}`] = keyData.note;
    });

    const handleKeyDown = (e) => {
      if (disabled || e.repeat) return;
      
      const note = keyMap[e.code];
      if (note && !pressedKeys.has(note)) {
        handleKeyPress(note);
      }
    };

    const handleKeyUp = (e) => {
      if (disabled) return;
      
      const note = keyMap[e.code];
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
  }, [disabled, pressedKeys, handleKeyPress, handleKeyRelease]);

  // Calculate positions for black keys
  const getBlackKeyPosition = (index) => {
    const whiteKeyIndex = PIANO_KEYS.slice(0, index).filter(k => !k.isBlack).length;
    const positions = [8.33, 25, 58.33, 75, 91.67]; // Positions relative to white keys
    const blackKeyIndex = PIANO_KEYS.slice(0, index).filter(k => k.isBlack).length;
    return positions[blackKeyIndex] || 0;
  };

  // Render piano keys
  const renderKeys = () => {
    const whiteKeys = [];
    const blackKeys = [];
    
    PIANO_KEYS.forEach((keyData, index) => {
      const isPressed = pressedKeys.has(keyData.note);
      
      const keyProps = {
        key: keyData.note,
        keyData,
        isPressed,
        onPress: handleKeyPress,
        onRelease: handleKeyRelease,
        disabled
      };
      
      if (keyData.isBlack) {
        const style = {
          left: `${getBlackKeyPosition(index)}%`,
          marginLeft: '-16px' // Half width of black key
        };
        blackKeys.push(
          <div key={keyData.note} className="absolute" style={style}>
            <PianoKey {...keyProps} />
          </div>
        );
      } else {
        whiteKeys.push(
          <div key={keyData.note} className="flex-1 mx-0.5">
            <PianoKey {...keyProps} />
          </div>
        );
      }
    });
    
    return { whiteKeys, blackKeys };
  };

  const { whiteKeys, blackKeys } = renderKeys();

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
          style={{ height: '220px' }}
        >
          {/* White Keys Container */}
          <div className="absolute inset-3 flex">
            {whiteKeys}
          </div>
          
          {/* Black Keys Container */}
          <div className="absolute inset-3">
            {blackKeys}
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

// Performance optimized piano for game mode
export const GamePiano = React.memo(({ 
  onKeystroke,
  gameState,
  showGuide = false 
}) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const { isGameActive } = useGame();
  
  // Handle key press with simplified game logic (just add points for any key press)
  const handleKeyPress = useCallback(async (note) => {
    if (!isGameActive()) return;

    const timestamp = Date.now();
    
    // Simple scoring - every key press gives points
    const keystrokeData = {
      key: note,
      timestamp: timestamp,
      points: 10 // Fixed points per key press
    };
    
    // Update local state
    setPressedKeys(prev => new Set([...prev, note]));
    
    // Send to game context
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
  }, [isGameActive, onKeystroke]);

  return (
    <Piano
      onKeyPress={handleKeyPress}
      pressedKeys={pressedKeys}
      disabled={!isGameActive()}
      className="game-piano"
    />
  );
});

GamePiano.displayName = 'GamePiano';

export default Piano;