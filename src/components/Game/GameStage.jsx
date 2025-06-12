// client/src/components/Game/GameStage.jsx - Enhanced with dancing characters
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useGame } from '../../contexts/GameContext';
import { useAudio } from '../../contexts/AudioContext';

// LED Ring Component
const LEDRing = ({ colors = [], intensity = 1, speed = 1, pattern = 'chase' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ledCount = 60; // Number of LEDs in the ring
  
  useEffect(() => {
    if (colors.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ledCount);
    }, 50 / speed);
    
    return () => clearInterval(interval);
  }, [colors.length, speed]);
  
  const getLEDColor = (index) => {
    if (colors.length === 0) return 'bg-gray-700';
    
    switch (pattern) {
      case 'chase':
        const distance = Math.min(
          Math.abs(index - currentIndex),
          Math.abs(index - currentIndex + ledCount),
          Math.abs(index - currentIndex - ledCount)
        );
        const colorIndex = Math.floor(distance / 3) % colors.length;
        return distance < 5 ? colors[colorIndex] : 'bg-gray-700';
      
      case 'pulse':
        const pulseIntensity = Math.sin((Date.now() * speed) / 1000) * 0.5 + 0.5;
        return colors[Math.floor((index / ledCount) * colors.length)];
      
      case 'rainbow':
        const hue = (index / ledCount) * 360 + (currentIndex * 2);
        return `hsl(${hue % 360}, 70%, 50%)`;
      
      default:
        return colors[index % colors.length];
    }
  };
  
  return (
    <div className="led-ring-container absolute inset-0">
      {Array.from({ length: ledCount }, (_, i) => {
        const angle = (i / ledCount) * 360;
        const radius = 45; // Percentage from center
        const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
        const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
        
        return (
          <motion.div
            key={i}
            className={clsx(
              'absolute w-3 h-3 rounded-full led-ring',
              getLEDColor(i)
            )}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: intensity
            }}
            animate={{
              scale: pattern === 'pulse' ? [1, 1.2, 1] : 1,
              opacity: intensity
            }}
            transition={{
              duration: pattern === 'pulse' ? 0.5 : 0,
              repeat: pattern === 'pulse' ? Infinity : 0
            }}
          />
        );
      })}
    </div>
  );
};

// Spotlight Component
const Spotlight = ({ x = 50, y = 50, size = 300, color = 'white', intensity = 0.8 }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: intensity,
        filter: 'blur(2px)',
        zIndex: 10
      }}
    />
  );
};

// Dancing Character Component - Uses the uploaded images
const DancingCharacter = ({ 
  imageSrc, 
  position, 
  isPlaying, 
  combo, 
  lastKeystrokeTime,
  className = '' 
}) => {
  const [danceMove, setDanceMove] = useState(0);
  const [isDancing, setIsDancing] = useState(false);
  const [idleTimer, setIdleTimer] = useState(null);
  
  // Check if character should be dancing based on recent activity
  useEffect(() => {
    if (!isPlaying) {
      setIsDancing(false);
      return;
    }
    
    // Start dancing when there's a keystroke
    if (lastKeystrokeTime) {
      setIsDancing(true);
      
      // Clear existing timer
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      
      // Set new timer to stop dancing after 5 seconds of inactivity
      const newTimer = setTimeout(() => {
        setIsDancing(false);
      }, 5000); // 5 seconds
      
      setIdleTimer(newTimer);
    }
    
    return () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    };
  }, [lastKeystrokeTime, isPlaying]);
  
  // Dance move animation when dancing
  useEffect(() => {
    if (!isDancing) return;
    
    const interval = setInterval(() => {
      setDanceMove(prev => (prev + 1) % 3);
    }, 500 + Math.random() * 500); // Random dance timing
    
    return () => clearInterval(interval);
  }, [isDancing]);
  
  const getDanceAnimation = () => {
    // Always return idle if not dancing (standing still)
    if (!isDancing || !isPlaying) return 'idle';
    
    // Dance intensity based on combo
    if (combo >= 50) return 'energetic';
    if (combo >= 25) return 'active';
    if (combo >= 10) return 'moderate';
    return 'gentle';
  };
  
  const danceVariants = {
    idle: {
      y: 0,
      rotate: 0,
      scale: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    gentle: {
      y: [0, -8, 0, -5, 0],
      rotate: [0, 2, -2, 1, 0],
      scale: [1, 1.02, 1, 1.01, 1],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
    },
    moderate: {
      y: [0, -12, 0, -8, 0],
      rotate: [0, 5, -5, 3, 0],
      scale: [1, 1.05, 1, 1.03, 1],
      x: [0, 2, -2, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
    },
    active: {
      y: [0, -15, 0, -10, 0, -12, 0],
      rotate: [0, 8, -8, 5, -3, 0],
      scale: [1, 1.08, 1, 1.05, 1, 1.03, 1],
      x: [0, 5, -5, 3, -2, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
    },
    energetic: {
      y: [0, -20, 0, -15, 0, -18, 0],
      rotate: [0, 15, -15, 10, -8, 12, 0],
      scale: [1, 1.12, 1, 1.08, 1, 1.1, 1],
      x: [0, 8, -8, 5, -5, 3, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
    }
  };
  
  return (
    <motion.div
      className={clsx('absolute pointer-events-none', className)}
      style={{
        left: `${position.x}%`,
        bottom: `${position.y}%`,
        transform: 'translate(-50%, 0)'
      }}
      variants={danceVariants}
      animate={getDanceAnimation()}
    >
      <div className="relative">
        {/* Character Image */}
        <img
          src={imageSrc}
          alt="Dancing character"
          className="w-24 h-32 object-contain drop-shadow-2xl"
          style={{
            filter: `brightness(${isDancing ? 1.1 : 0.9}) saturate(${combo >= 25 && isDancing ? 1.3 : 1})`
          }}
        />
        
        {/* Glow effect for high combos - only when dancing */}
        {combo >= 25 && isDancing && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 40px rgba(168, 85, 247, 0.7)',
                '0 0 20px rgba(59, 130, 246, 0.5)'
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        
        {/* Musical notes animation - only when dancing */}
        {isDancing && combo >= 10 && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: -30, 
              scale: [0, 1, 1.2],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 1 + Math.random() 
            }}
            className="absolute -top-8 -right-2 text-yellow-400 text-lg"
          >
            {['♪', '♫', '♬'][Math.floor(Math.random() * 3)]}
          </motion.div>
        )}
        
        {/* Combo burst effect - only when dancing */}
        <AnimatePresence>
          {combo > 0 && combo % 25 === 0 && isDancing && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 border-4 border-yellow-400 rounded-full"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Particle System Component
const ParticleSystem = ({ effects = [], isActive = false }) => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!isActive || effects.length === 0) return;
    
    const createParticle = (effect) => ({
      id: Math.random(),
      type: effect.type,
      x: Math.random() * 100,
      y: Math.random() * 100,
      life: 1,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * -2 - 1
      }
    });
    
    const newParticles = effects.flatMap(effect => 
      Array.from({ length: effect.count || 5 }, () => createParticle(effect))
    );
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Cleanup particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 3000);
  }, [effects, isActive]);
  
  return (
    <div ref={containerRef} className="particle-system absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: `${particle.x}%`,
              y: `${particle.y}%`
            }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              x: `${particle.x + particle.velocity.x * 50}%`,
              y: `${particle.y + particle.velocity.y * 50}%`,
              rotate: 360
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className={clsx(
              'absolute w-3 h-3 rounded-full',
              {
                'bg-yellow-400 shadow-lg shadow-yellow-400/50': particle.type === 'coin',
                'bg-green-400 shadow-lg shadow-green-400/50': particle.type === 'perfect',
                'bg-blue-400 shadow-lg shadow-blue-400/50': particle.type === 'good',
                'bg-purple-400 shadow-lg shadow-purple-400/50': particle.type === 'combo'
              }
            )}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Main Game Stage Component
const GameStage = ({ className = '' }) => {
  const { 
    gameState, 
    score, 
    stats, 
    isGameActive,
    recentKeystrokes 
  } = useGame();
  
  const { volume, isPlaying } = useAudio();
  const [stageEffects, setStageEffects] = useState([]);
  const [ledColors, setLedColors] = useState(['bg-blue-500']);
  const [spotlights, setSpotlights] = useState([]);
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState(null);

  // Character images - You'll need to add these to your public folder
  const characters = [
    {
      src: '/images/character1.gif', // Your first character GIF
      position: { x: 20, y: 15 }
    },
    {
      src: '/images/character2.gif', // Your second character GIF  
      position: { x: 50, y: 10 }
    },
    {
      src: '/images/character3.gif', // Your third character GIF
      position: { x: 80, y: 15 }
    }
  ];

  // Track last keystroke time for character dancing
  useEffect(() => {
    if (recentKeystrokes.length > 0) {
      setLastKeystrokeTime(Date.now());
    }
  }, [recentKeystrokes]);
  
  // LED color patterns based on game state
  const ledPatterns = useMemo(() => ({
    idle: ['bg-blue-500', 'bg-purple-500'],
    playing: ['bg-green-500', 'bg-blue-500', 'bg-purple-500'],
    excellent: ['bg-green-500', 'bg-yellow-400'],
    good: ['bg-blue-500', 'bg-indigo-500'],
    combo: ['bg-red-500', 'bg-orange-500', 'bg-yellow-400'],
    completed: ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-400']
  }), []);
  
  // Update LED colors based on performance
  useEffect(() => {
    if (!isGameActive()) {
      setLedColors(ledPatterns.idle);
      return;
    }
    
    if (score.combo >= 50) {
      setLedColors(ledPatterns.combo);
    } else if (stats.accuracy >= 95) {
      setLedColors(ledPatterns.excellent);
    } else if (stats.accuracy >= 80) {
      setLedColors(ledPatterns.good);
    } else {
      setLedColors(ledPatterns.playing);
    }
  }, [isGameActive, score.combo, stats.accuracy, ledPatterns]);
  
  // Create effects from recent keystrokes
  useEffect(() => {
    if (recentKeystrokes.length === 0) return;
    
    const latestKeystroke = recentKeystrokes[recentKeystrokes.length - 1];
    if (!latestKeystroke) return;
    
    const newEffects = [];
    
    // Add particle effects based on accuracy
    if (latestKeystroke.accuracy === 'perfect') {
      newEffects.push({ type: 'perfect', count: 8 });
    } else if (latestKeystroke.accuracy === 'good') {
      newEffects.push({ type: 'good', count: 5 });
    }
    
    // Add combo effects
    if (score.combo > 0 && score.combo % 10 === 0) {
      newEffects.push({ type: 'combo', count: 12 });
    }
    
    // Add coin effects for score milestones
    if (score.current > 0 && score.current % 1000 === 0) {
      newEffects.push({ type: 'coin', count: 6 });
    }
    
    setStageEffects(newEffects);
    
    // Clear effects after a short time
    setTimeout(() => setStageEffects([]), 100);
  }, [recentKeystrokes, score.combo, score.current]);
  
  // Dynamic spotlights
  useEffect(() => {
    if (!isGameActive()) {
      setSpotlights([
        { x: 50, y: 60, size: 400, color: 'rgba(59, 130, 246, 0.3)', intensity: 0.6 }
      ]);
      return;
    }
    
    const newSpotlights = [
      { x: 20, y: 50, size: 250, color: 'rgba(34, 197, 94, 0.4)', intensity: 0.7 },
      { x: 50, y: 40, size: 300, color: 'rgba(168, 85, 247, 0.4)', intensity: 0.8 },
      { x: 80, y: 50, size: 250, color: 'rgba(59, 130, 246, 0.4)', intensity: 0.7 }
    ];
    
    setSpotlights(newSpotlights);
  }, [isGameActive]);
  
  return (
    <div className={clsx('game-stage relative w-full h-96 overflow-hidden rounded-t-2xl', className)}>
      {/* Stage Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900/50 to-black">
        {/* Stage Floor Grid */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800/80 to-transparent">
          <div className="grid-pattern absolute inset-0 opacity-20"
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px'
               }}
          />
        </div>
      </div>
      
      {/* LED Ring Effects */}
      <LEDRing 
        colors={ledColors}
        intensity={isGameActive() ? 1 : 0.5}
        speed={isGameActive() ? 2 : 0.5}
        pattern={score.combo >= 20 ? 'chase' : 'pulse'}
      />
      
      {/* Spotlights */}
      {spotlights.map((spotlight, index) => (
        <Spotlight key={index} {...spotlight} />
      ))}
      
      {/* Dancing Characters */}
      {characters.map((character, index) => (
        <DancingCharacter
          key={index}
          imageSrc={character.src}
          position={character.position}
          isPlaying={isGameActive()}
          combo={score.combo}
          lastKeystrokeTime={lastKeystrokeTime}
          className={`character-${index + 1}`}
        />
      ))}
      
      {/* Particle Effects */}
      <ParticleSystem
        effects={stageEffects}
        isActive={isGameActive()}
      />
      
      {/* Stage Curtains */}
      <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-red-900/80 to-transparent z-30"></div>
      <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-red-900/80 to-transparent z-30"></div>
      
      {/* Stage Header with Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-20">
        <div className="flex justify-center items-center h-full">
          <div className="flex space-x-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={clsx(
                  'w-3 h-3 rounded-full',
                  isGameActive() ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                )}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Performance Feedback Overlay */}
      <AnimatePresence>
        {score.combo >= 10 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2 animate-pulse">
                COMBO x{score.combo}
              </div>
              {score.combo >= 50 && (
                <div className="text-xl text-white font-semibold animate-bounce">
                  AMAZING!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Achievement Notifications */}
      <AnimatePresence>
        {score.combo === 25 && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-20 left-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg z-40"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                🏆
              </div>
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm opacity-90">Combo Master</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Audio Visualizer */}
      {isPlaying && (
        <div className="absolute bottom-4 left-4 flex space-x-1 z-30">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
              animate={{
                height: [4, Math.random() * 20 + 8, 4],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      )}
      
      {/* Stage Smoke Effects */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            filter: 'blur(20px)',
            borderRadius: '50%'
          }}
        />
      </div>
      
      {/* Stage Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Moving light beams */}
        <motion.div
          className="absolute top-0 w-2 h-full bg-gradient-to-b from-yellow-400/20 to-transparent"
          animate={{
            left: ['10%', '90%', '10%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ filter: 'blur(3px)' }}
        />
        
        <motion.div
          className="absolute top-0 w-2 h-full bg-gradient-to-b from-pink-400/20 to-transparent"
          animate={{
            right: ['10%', '90%', '10%']
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
          style={{ filter: 'blur(3px)' }}
        />
      </div>
      
      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-400 opacity-50"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-400 opacity-50"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-400 opacity-50"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-yellow-400 opacity-50"></div>
    </div>
  );
};

export default GameStage;