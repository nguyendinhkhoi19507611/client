// src/components/Game/GameStage.jsx - Loại bỏ hiệu ứng combo
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useGame } from '../../contexts/GameContext';
import { useAudio } from '../../contexts/AudioContext';

// LED Ring Component - đơn giản hóa
const LEDRing = ({ colors = [], intensity = 1, speed = 1 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ledCount = 60;
  
  useEffect(() => {
    if (colors.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ledCount);
    }, 100 / speed);
    
    return () => clearInterval(interval);
  }, [colors.length, speed]);
  
  const getLEDColor = (index) => {
    if (colors.length === 0) return 'bg-gray-700';
    
    const distance = Math.min(
      Math.abs(index - currentIndex),
      Math.abs(index - currentIndex + ledCount),
      Math.abs(index - currentIndex - ledCount)
    );
    const colorIndex = Math.floor(distance / 3) % colors.length;
    return distance < 5 ? colors[colorIndex] : 'bg-gray-700';
  };
  
  return (
    <div className="led-ring-container absolute inset-0">
      {Array.from({ length: ledCount }, (_, i) => {
        const angle = (i / ledCount) * 360;
        const radius = 45;
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

// Dancing Character Component - Enhanced with combo animations
const DancingCharacter = ({ 
  imageSrc, 
  position, 
  isPlaying, 
  lastKeystrokeTime,
  comboSpeed = 1, // Add combo speed parameter
  className = '' 
}) => {
  const [isDancing, setIsDancing] = useState(false);
  const [idleTimer, setIdleTimer] = useState(null);
  const [jumpHeight, setJumpHeight] = useState(0);
  
  // Check if character should be dancing based on recent activity
  useEffect(() => {
    if (!isPlaying) {
      setIsDancing(false);
      return;
    }
    
    // Start dancing when there's a keystroke
    if (lastKeystrokeTime) {
      setIsDancing(true);
      
      // Increase jump height based on combo speed
      setJumpHeight(Math.min(30, comboSpeed * 10));
      
      // Clear existing timer
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      
      // Set new timer to stop dancing after 3 seconds of inactivity
      const newTimer = setTimeout(() => {
        setIsDancing(false);
        setJumpHeight(0);
      }, 3000);
      
      setIdleTimer(newTimer);
    }
    
    return () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    };
  }, [lastKeystrokeTime, isPlaying, comboSpeed]);
  
  const getDanceAnimation = () => {
    if (!isDancing || !isPlaying) return 'idle';
    return comboSpeed >= 2 ? 'excitedDancing' : 'dancing';
  };
  
  const danceVariants = {
    idle: {
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    dancing: {
      y: [0, -10, 0, -6, 0],
      rotate: [0, 3, -3, 2, 0],
      scale: [1, 1.05, 1, 1.02, 1],
      transition: { 
        duration: 1, 
        repeat: Infinity, 
        ease: 'easeInOut'
      }
    },
    excitedDancing: {
      y: [0, -jumpHeight, 0, -(jumpHeight * 0.6), 0],
      rotate: [0, 5, -5, 3, 0],
      scale: [1, 1.1, 1, 1.05, 1],
      transition: { 
        duration: 0.8 / Math.min(2, comboSpeed), 
        repeat: Infinity, 
        ease: 'easeInOut'
      }
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
        {/* Character Image with glow effect */}
        <motion.img
          src={imageSrc}
          alt="Dancing character"
          className="w-24 h-32 object-contain"
          style={{
            filter: `brightness(${isDancing ? 1.2 : 0.9}) drop-shadow(0 0 ${Math.min(8, comboSpeed * 3)}px rgba(255, 255, 255, 0.8))`
          }}
          animate={{
            scale: isDancing ? [1, 1.02, 1] : 1,
            transition: { duration: 0.5, repeat: Infinity }
          }}
        />
        
        {/* Musical notes animation - enhanced with combo speed */}
        {isDancing && (
          <AnimatePresence>
            {[...Array(Math.min(3, Math.ceil(comboSpeed)))].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: -40 - (i * 10), 
                  x: (i % 2 === 0 ? 10 : -10),
                  scale: [0, 1, 1.2],
                  rotate: [0, 10, -10, 0]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 1.5 / Math.min(2, comboSpeed), 
                  repeat: Infinity, 
                  repeatDelay: 0.2 + (i * 0.1)
                }}
                className="absolute -top-8 text-yellow-400 text-lg"
                style={{
                  left: `${50 + (i * 15)}%`,
                  filter: `drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))`
                }}
              >
                {['♪', '♫', '♬'][i % 3]}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Ground reflection effect */}
        {isDancing && (
          <motion.div
            className="absolute bottom-0 left-1/2 w-16 h-4 -translate-x-1/2"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
              transform: 'scaleY(0.3)'
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 0.8 / Math.min(2, comboSpeed),
              repeat: Infinity
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

// Particle System Component - đơn giản hóa
const ParticleSystem = ({ effects = [], isActive = false }) => {
  const [particles, setParticles] = useState([]);
  
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
      Array.from({ length: effect.count || 3 }, () => createParticle(effect))
    );
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Cleanup particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 2000);
  }, [effects, isActive]);
  
  return (
    <div className="particle-system absolute inset-0 pointer-events-none overflow-hidden">
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
              x: `${particle.x + particle.velocity.x * 30}%`,
              y: `${particle.y + particle.velocity.y * 30}%`,
              rotate: 180
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className={clsx(
              'absolute w-3 h-3 rounded-full',
              {
                'bg-yellow-400': particle.type === 'coin',
                'bg-green-400': particle.type === 'perfect',
                'bg-blue-400': particle.type === 'good'
              }
            )}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Main Game Stage Component - đơn giản hóa
const GameStage = ({ className = '' }) => {
  const { 
    gameState, 
    score, 
    stats, 
    isGameActive,
    recentKeystrokes 
  } = useGame();
  
  const { isPlaying } = useAudio();
  const [stageEffects, setStageEffects] = useState([]);
  const [ledColors, setLedColors] = useState(['bg-blue-500']);
  const [spotlights, setSpotlights] = useState([]);
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState(null);

  // Character images - placeholder paths
  const characters = [
    {
      src: '/images/character1.gif',
      position: { x: 25, y: 15 }
    },
    {
      src: '/images/character2.gif',
      position: { x: 50, y: 10 }
    },
    {
      src: '/images/character3.gif',
      position: { x: 75, y: 15 }
    }
  ];

  // Track last keystroke time
  useEffect(() => {
    if (recentKeystrokes.length > 0) {
      setLastKeystrokeTime(Date.now());
    }
  }, [recentKeystrokes]);
  
  // LED color patterns based on game state
  const ledPatterns = useMemo(() => ({
    idle: ['bg-blue-500', 'bg-purple-500'],
    playing: ['bg-green-500', 'bg-blue-500'],
    excellent: ['bg-green-500', 'bg-yellow-400'],
    good: ['bg-blue-500', 'bg-indigo-500']
  }), []);
  
  // Update LED colors based on performance
  useEffect(() => {
    if (!isGameActive()) {
      setLedColors(ledPatterns.idle);
      return;
    }
    
    if (stats.accuracy >= 95) {
      setLedColors(ledPatterns.excellent);
    } else if (stats.accuracy >= 80) {
      setLedColors(ledPatterns.good);
    } else {
      setLedColors(ledPatterns.playing);
    }
  }, [isGameActive, stats.accuracy, ledPatterns]);
  
  // Create effects from recent keystrokes
  useEffect(() => {
    if (recentKeystrokes.length === 0) return;
    
    const latestKeystroke = recentKeystrokes[recentKeystrokes.length - 1];
    if (!latestKeystroke) return;
    
    const newEffects = [];
    
    // Add particle effects based on accuracy
    if (latestKeystroke.accuracy === 'perfect') {
      newEffects.push({ type: 'perfect', count: 5 });
    } else if (latestKeystroke.accuracy === 'good') {
      newEffects.push({ type: 'good', count: 3 });
    }
    
    // Add coin effects for every 10th key press
    if (stats.totalKeys > 0 && stats.totalKeys % 10 === 0) {
      newEffects.push({ type: 'coin', count: 3 });
    }
    
    setStageEffects(newEffects);
    
    // Clear effects after a short time
    setTimeout(() => setStageEffects([]), 100);
  }, [recentKeystrokes, stats.totalKeys]);
  
  // Dynamic spotlights
  useEffect(() => {
    if (!isGameActive()) {
      setSpotlights([
        { x: 50, y: 60, size: 400, color: 'rgba(59, 130, 246, 0.3)', intensity: 0.6 }
      ]);
      return;
    }
    
    const newSpotlights = [
      { x: 25, y: 50, size: 250, color: 'rgba(34, 197, 94, 0.4)', intensity: 0.7 },
      { x: 50, y: 40, size: 300, color: 'rgba(168, 85, 247, 0.4)', intensity: 0.8 },
      { x: 75, y: 50, size: 250, color: 'rgba(59, 130, 246, 0.4)', intensity: 0.7 }
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
        speed={isGameActive() ? 1.5 : 0.5}
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
          lastKeystrokeTime={lastKeystrokeTime}
          comboSpeed={isGameActive() ? 1.5 : 1}
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
      
      {/* Stage Header */}
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
      
      {/* Simple Score Display */}
      {score.current > 0 && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40">
          <div className="text-center bg-black/50 rounded-lg px-4 py-2">
            <div className="text-2xl font-bold text-yellow-400">
              {score.current} Points
            </div>
            <div className="text-sm text-gray-300">
              {stats.totalKeys} keys pressed
            </div>
          </div>
        </div>
      )}
      
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
      
      {/* Stage Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none">
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