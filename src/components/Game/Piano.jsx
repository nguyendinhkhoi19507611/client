// client/src/components/Game/Piano.jsx - Interactive piano keyboard component
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAudio } from '../../contexts/AudioContext';
import { useGame } from '../../contexts/GameContext';
import { PIANO_KEYS, NOTE_FREQUENCIES } from '../../utils/pianoConstants';
// Piano Key Component
const PianoKey = ({ 
  note, 
  isBlack = false, 
  isPressed = false, 
  onPress, 
  onRelease,
  disabled = false,
  showLabel = false,
  accuracy = null,
  effects = []
}) => {
  const keyRef = useRef(null);
  const [localPressed, setLocalPressed] = useState(false);
  const [showAccuracy, setShowAccuracy] = useState(false);

  // Handle key press animation
  useEffect(() => {
    if (isPressed && !localPressed) {
      setLocalPressed(true);
      
      // Show accuracy feedback
      if (accuracy) {
        setShowAccuracy(true);
        setTimeout(() => setShowAccuracy(false), 500);
      }
      
      // Reset after animation
      setTimeout(() => setLocalPressed(false), 150);
    }
  }, [isPressed, localPressed, accuracy]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      onPress(note);
    }
  }, [note, onPress, disabled]);

  const handleMouseUp = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      onRelease(note);
    }
  }, [note, onRelease, disabled]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      onPress(note);
    }
  }, [note, onPress, disabled]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      onRelease(note);
    }
  }, [note, onRelease, disabled]);

  // Accuracy color mapping
  const getAccuracyColor = (acc) => {
    switch (acc) {
      case 'perfect': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'miss': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const keyClasses = clsx(
    'relative select-none cursor-pointer transition-all duration-75 border border-opacity-20',
    {
      // White keys
      'piano-key-white h-32 flex-1 mx-px': !isBlack,
      'bg-white hover:bg-gray-100 border-gray-300': !isBlack && !isPressed && !localPressed,
      'bg-blue-500 border-blue-600 transform translate-y-1': !isBlack && (isPressed || localPressed),
      
      // Black keys
      'piano-key-black h-20 w-8 absolute z-10 -ml-4': isBlack,
      'bg-gray-900 hover:bg-gray-800 border-gray-700': isBlack && !isPressed && !localPressed,
      'bg-blue-600 border-blue-700 transform translate-y-0.5': isBlack && (isPressed || localPressed),
      
      // Disabled state
      'opacity-50 cursor-not-allowed': disabled,
      
      // Accuracy feedback
      'ring-2 ring-green-400 ring-opacity-75': accuracy === 'perfect',
      'ring-2 ring-yellow-400 ring-opacity-75': accuracy === 'good',
      'ring-2 ring-red-400 ring-opacity-75': accuracy === 'miss'
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
        y: isPressed || localPressed ? (isBlack ? 1 : 2) : 0
      }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
    >
      {/* Key Label */}
      {showLabel && (
        <div className={clsx(
          'absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono',
          isBlack ? 'text-white' : 'text-gray-600'
        )}>
          {note}
        </div>
      )}

      {/* Accuracy Feedback */}
      <AnimatePresence>
        {showAccuracy && accuracy && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -20 }}
            exit={{ opacity: 0, scale: 0.5, y: -40 }}
            className={clsx(
              'absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold z-20',
              getAccuracyColor(accuracy)
            )}
          >
            {accuracy.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hit Effects */}
      <AnimatePresence>
        {effects.map((effect, index) => (
          <motion.div
            key={`${effect.type}-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className={clsx(
              'absolute inset-0 pointer-events-none rounded',
              {
                'bg-gradient-to-t from-green-400 to-transparent opacity-30': effect.type === 'perfect',
                'bg-gradient-to-t from-yellow-400 to-transparent opacity-20': effect.type === 'good',
                'bg-gradient-to-t from-red-400 to-transparent opacity-20': effect.type === 'miss'
              }
            )}
          />
        ))}
      </AnimatePresence>

      {/* Glow effect for active keys */}
      {(isPressed || localPressed) && (
        <div className={clsx(
          'absolute inset-0 rounded pointer-events-none',
          isBlack ? 'shadow-lg shadow-blue-500/50' : 'shadow-lg shadow-blue-400/50'
        )} />
      )}
    </motion.div>
  );
};

// Main Piano Component
const Piano = ({ 
  onKeyPress, 
  onKeyRelease, 
  activeKeys = new Set(),
  pressedKeys = new Set(),
  disabled = false,
  showLabels = false,
  keyEffects = {},
  accuracy = {},
  className = ''
}) => {
  const pianoRef = useRef(null);
  const { playNote, stopNote } = useAudio();
  const { gameSettings } = useGame();
  
  // Key press handlers
  const handleKeyPress = useCallback(async (note) => {
    if (disabled) return;
    
    // Play audio
    if (gameSettings.soundEnabled) {
      await playNote(note);
    }
    
    // Trigger callback
    if (onKeyPress) {
      onKeyPress(note);
    }
  }, [disabled, gameSettings.soundEnabled, playNote, onKeyPress]);

  const handleKeyRelease = useCallback((note) => {
    if (disabled) return;
    
    // Stop audio
    if (gameSettings.soundEnabled) {
      stopNote(note);
    }
    
    // Trigger callback
    if (onKeyRelease) {
      onKeyRelease(note);
    }
  }, [disabled, gameSettings.soundEnabled, stopNote, onKeyRelease]);

  // Keyboard event handlers
  useEffect(() => {
    const keyMap = {
      'KeyA': 'C4', 'KeyW': 'C#4', 'KeyS': 'D4', 'KeyE': 'D#4', 'KeyD': 'E4',
      'KeyF': 'F4', 'KeyT': 'F#4', 'KeyG': 'G4', 'KeyY': 'G#4', 'KeyH': 'A4',
      'KeyU': 'A#4', 'KeyJ': 'B4', 'KeyK': 'C5', 'KeyO': 'C#5', 'KeyL': 'D5',
      'KeyP': 'D#5', 'Semicolon': 'E5'
    };

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

  // Render piano keys
  const renderKeys = () => {
    const whiteKeys = [];
    const blackKeys = [];
    
    PIANO_KEYS.forEach((note, index) => {
      const isBlack = note.includes('#');
      const isActive = activeKeys.has(note);
      const isPressed = pressedKeys.has(note);
      const keyAccuracy = accuracy[note];
      const effects = keyEffects[note] || [];
      
      const keyProps = {
        key: note,
        note,
        isBlack,
        isPressed: isActive || isPressed,
        onPress: handleKeyPress,
        onRelease: handleKeyRelease,
        disabled,
        showLabel: showLabels,
        accuracy: keyAccuracy,
        effects
      };
      
      if (isBlack) {
        // Position black keys between white keys
        const blackKeyStyle = {
          left: `${getBlackKeyPosition(note)}%`
        };
        blackKeys.push(
          <div key={note} className="absolute" style={blackKeyStyle}>
            <PianoKey {...keyProps} />
          </div>
        );
      } else {
        whiteKeys.push(<PianoKey {...keyProps} />);
      }
    });
    
    return { whiteKeys, blackKeys };
  };

  // Calculate black key positions
  const getBlackKeyPosition = (note) => {
    const blackKeyPositions = {
      'C#4': 6.25, 'D#4': 18.75, 'F#4': 43.75, 'G#4': 56.25, 'A#4': 68.75,
      'C#5': 93.75, 'D#5': 106.25
    };
    return blackKeyPositions[note] || 0;
  };

  const { whiteKeys, blackKeys } = renderKeys();

  return (
    <div className={clsx('piano-container relative', className)}>
      {/* Piano Frame */}
      <div className="piano-frame bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-t-lg shadow-2xl">
        {/* Piano Brand/Logo */}
        <div className="text-center mb-4">
          <h3 className="text-white font-display text-lg font-bold tracking-wider">
            BIGCOIN PIANO
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-1 rounded"></div>
        </div>
        
        {/* Piano Keyboard */}
        <div 
          ref={pianoRef}
          className="piano-keyboard relative bg-black p-2 rounded-lg shadow-inner"
          style={{ height: '200px' }}
        >
          {/* White Keys Container */}
          <div className="absolute inset-2 flex">
            {whiteKeys}
          </div>
          
          {/* Black Keys Container */}
          <div className="absolute inset-2">
            {blackKeys}
          </div>
          
          {/* Piano Lid Reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg pointer-events-none"></div>
        </div>
        
        {/* Piano Controls */}
        <div className="flex justify-between items-center mt-4 px-2">
          {/* Volume Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">AUDIO</span>
          </div>
          
          {/* Key Guide */}
          {showLabels && (
            <div className="text-xs text-gray-400 text-center">
              <div>A-L keys: Piano keys</div>
              <div>W,E,T,Y,U,O,P: Black keys</div>
            </div>
          )}
          
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
      
      {/* Piano Legs/Stand */}
      <div className="piano-stand flex justify-center">
        <div className="w-8 h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg shadow-lg"></div>
      </div>
      
      {/* Piano Shadow */}
      <div className="piano-shadow absolute -bottom-2 left-4 right-4 h-4 bg-black/20 rounded-full blur-sm"></div>
    </div>
  );
};

// Performance optimized piano for game mode
export const GamePiano = React.memo(({ 
  onKeystroke,
  currentNotes = [],
  gameState,
  showGuide = false 
}) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [keyEffects, setKeyEffects] = useState({});
  const [accuracy, setAccuracy] = useState({});
  const { processKeystroke, isGameActive } = useGame();
  
  // Handle key press with game logic
  const handleKeyPress = useCallback(async (note) => {
    if (!isGameActive()) return;
    
    const timestamp = Date.now();
    const currentTime = timestamp; // Game time would be calculated differently
    
    // Determine accuracy based on current notes
    let noteAccuracy = 'miss';
    const expectedNote = currentNotes.find(n => n.note === note && 
      Math.abs(n.time - currentTime) < 200); // 200ms window
    
    if (expectedNote) {
      const timeDiff = Math.abs(expectedNote.time - currentTime);
      if (timeDiff < 50) noteAccuracy = 'perfect';
      else if (timeDiff < 100) noteAccuracy = 'good';
      else noteAccuracy = 'miss';
    }
    
    // Process keystroke
    const keystrokeData = {
      key: note,
      timestamp: currentTime,
      accuracy: noteAccuracy,
      reactionTime: expectedNote ? Math.abs(expectedNote.time - currentTime) : 0
    };
    
    // Update local state
    setPressedKeys(prev => new Set([...prev, note]));
    setAccuracy(prev => ({ ...prev, [note]: noteAccuracy }));
    setKeyEffects(prev => ({ 
      ...prev, 
      [note]: [{ type: noteAccuracy, timestamp }] 
    }));
    
    // Send to game context
    if (processKeystroke) {
      await processKeystroke(keystrokeData);
    }
    
    if (onKeystroke) {
      onKeystroke(keystrokeData);
    }
    
    // Clear effects after animation
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      setAccuracy(prev => {
        const newAccuracy = { ...prev };
        delete newAccuracy[note];
        return newAccuracy;
      });
      setKeyEffects(prev => {
        const newEffects = { ...prev };
        delete newEffects[note];
        return newEffects;
      });
    }, 500);
  }, [isGameActive, currentNotes, processKeystroke, onKeystroke]);

  // Show upcoming notes as active keys
  const activeKeys = useMemo(() => {
    const now = Date.now();
    return new Set(
      currentNotes
        .filter(note => Math.abs(note.time - now) < 1000) // Show notes within 1 second
        .map(note => note.note)
    );
  }, [currentNotes]);

  return (
    <Piano
      onKeyPress={handleKeyPress}
      activeKeys={activeKeys}
      pressedKeys={pressedKeys}
      disabled={!isGameActive()}
      showLabels={showGuide}
      keyEffects={keyEffects}
      accuracy={accuracy}
      className="game-piano"
    />
  );
});

GamePiano.displayName = 'GamePiano';

export default Piano;