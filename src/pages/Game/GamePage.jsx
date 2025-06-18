// src/pages/Game/GamePage.jsx - Updated to remove duplicate notation
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings, 
  Trophy,
  Coins,
  Timer,
  ArrowLeft,
  Home,
  Music,
  Eye,
  EyeOff
} from 'lucide-react';

// Components
import GameStage from '../../components/Game/GameStage';
import { GamePiano } from '../../components/Game/Piano';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Modal from '../../components/UI/Modal';

// Contexts and Services
import { useGame, GAME_STATES } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAudio } from '../../contexts/AudioContext';
import { formatTime, formatNumber } from '../../utils/formatters';

// Enhanced Game Settings Modal
const GameSettingsModal = ({ isOpen, onClose, onSave }) => {
  const { gameSettings } = useGame();
  const [settings, setSettings] = useState({
    ...gameSettings,
    showNotation: true,
    showKeyGuide: true,
    pianoSize: 'normal',
    noteSpeed: 'medium'
  });

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Settings" size="lg">
      <div className="space-y-6">
        {/* Audio Settings */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Audio Settings</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Sound Effects</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Visual Effects</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, visualEffects: !prev.visualEffects }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.visualEffects ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.visualEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Display Settings */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Display Settings</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Show Music Notation</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, showNotation: !prev.showNotation }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showNotation ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showNotation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Show Key Guide</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, showKeyGuide: !prev.showKeyGuide }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showKeyGuide ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showKeyGuide ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Piano Size
            </label>
            <select
              value={settings.pianoSize}
              onChange={(e) => setSettings(prev => ({ ...prev, pianoSize: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Enhanced Game Results Modal
const GameResultsModal = ({ isOpen, onClose, onPlayAgain, onClaimRewards }) => {
  const { score, stats, rewards, isGameCompleted, isClaiming } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && isGameCompleted()) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen, isGameCompleted]);

  const getPerformanceGrade = () => {
    if (score.current >= 2000) return { grade: 'S+', color: 'text-yellow-400', desc: 'Legendary!' };
    if (score.current >= 1500) return { grade: 'S', color: 'text-yellow-400', desc: 'Perfect!' };
    if (score.current >= 1000) return { grade: 'A', color: 'text-green-400', desc: 'Excellent!' };
    if (score.current >= 600) return { grade: 'B', color: 'text-blue-400', desc: 'Great!' };
    if (score.current >= 400) return { grade: 'C', color: 'text-orange-400', desc: 'Good!' };
    return { grade: 'D', color: 'text-red-400', desc: 'Keep practicing!' };
  };

  const performance = getPerformanceGrade();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Complete!" size="lg">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                y: -100, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                opacity: 0, 
                y: window.innerHeight + 100,
                rotate: 360,
                scale: 0
              }}
              transition={{ 
                duration: 4,
                delay: Math.random() * 2,
                ease: 'easeOut'
              }}
              className={`absolute w-2 h-2 rounded ${
                ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'][i % 5]
              }`}
            />
          ))}
        </div>
      )}

      <div className="space-y-6">
        {/* Performance Grade */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
            className={`text-8xl font-bold ${performance.color} mb-2`}
          >
            {performance.grade}
          </motion.div>
          <p className="text-2xl text-gray-300 mb-4">{performance.desc}</p>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{formatNumber(score.current)}</div>
            <div className="text-sm text-gray-400">Total Score</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.totalKeys}</div>
            <div className="text-sm text-gray-400">Keys Pressed</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.accuracy}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.keysPerMinute}</div>
            <div className="text-sm text-gray-400">Keys/Min</div>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 rounded-lg p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-yellow-400 flex items-center">
              <Coins className="w-5 h-5 mr-2" />
              Rewards Earned
            </h3>
            {!rewards.claimed && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-green-400 text-sm font-medium"
              >
                Ready to claim!
              </motion.div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Base Coins:</span>
              <span className="text-yellow-400 font-medium">+{rewards.coins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Performance Bonus:</span>
              <span className="text-green-400 font-medium">+{Math.floor(score.current * 0.01)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-gray-300">Total Earned:</span>
              <span className="text-yellow-400">+{rewards.coins + Math.floor(score.current * 0.01)} BC</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          {!rewards.claimed && (
            <Button 
              onClick={onClaimRewards} 
              loading={isClaiming}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500"
            >
              Claim Rewards
            </Button>
          )}
          <Button onClick={onPlayAgain} className="flex-1">
            Play Again
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Main Game Page Component
const GamePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const musicId = searchParams.get('music');
  
  // Contexts
  const { user } = useAuth();
  const { 
    gameState, 
    currentMusic, 
    score, 
    stats, 
    startGame, 
    pauseGame, 
    resumeGame, 
    endGame, 
    claimRewards,
    updateSettings,
    setMusic,
    isGameActive,
    isGamePaused,
    isGameCompleted,
    getGameProgress,
    isStarting,
    isEnding,
    isClaiming,
    getMusicById,
    defaultMusic
  } = useGame();
  
  const { volume, setVolume, isMuted, toggleMute } = useAudio();
  
  // Local state
  const [showSettings, setShowSettings] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    visualEffects: true,
    showNotation: true,
    showKeyGuide: true,
    pianoSize: 'normal',
    noteSpeed: 'medium'
  });

  // Load music data
  useEffect(() => {
    const fetchMusic = async () => {
      if (musicId && musicId !== 'default') {
        setIsLoading(true);
        try {
          const music = await getMusicById(musicId);
          if (music) {
            setMusic(music);
          } else {
            toast.error('Music not found, using default music');
            setMusic(defaultMusic);
          }
        } catch (err) {
          toast.error('Error fetching music, using default music');
          setMusic(defaultMusic);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMusic(defaultMusic);
      }
    };

    fetchMusic();
  }, [musicId, getMusicById, setMusic, defaultMusic]);

  // Handle game completion
  useEffect(() => {
    if (isGameCompleted()) {
      setShowResults(true);
    }
  }, [isGameCompleted]);

  // Game progress tracking
  const progress = getGameProgress();

  // Game handlers
  const handleStartGame = useCallback(async () => {
    try {
      await startGame(musicId || 'default', gameSettings);
    } catch (error) {
      toast.error('Failed to start game');
    }
  }, [musicId, startGame, gameSettings]);

  const handlePauseResume = useCallback(() => {
    if (isGameActive()) {
      pauseGame();
    } else if (isGamePaused()) {
      resumeGame();
    }
  }, [isGameActive, isGamePaused, pauseGame, resumeGame]);

  const handleEndGame = useCallback(async () => {
    try {
      await endGame();
    } catch (error) {
      toast.error('Failed to end game');
    }
  }, [endGame]);

  const handleClaimRewards = useCallback(async () => {
    try {
      await claimRewards();
      setShowResults(false);
      toast.success('Rewards claimed successfully!');
    } catch (error) {
      toast.error('Failed to claim rewards');
    }
  }, [claimRewards]);

  const handlePlayAgain = useCallback(() => {
    setShowResults(false);
    handleStartGame();
  }, [handleStartGame]);

  const handleKeystroke = useCallback((keystrokeData) => {
    console.log('Enhanced key pressed:', keystrokeData.key, 'Points:', keystrokeData.points);
  }, []);

  const handleUpdateSettings = useCallback((newSettings) => {
    setGameSettings(newSettings);
    updateSettings(newSettings);
  }, [updateSettings]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading music..." />
      </div>
    );
  }

  const displayMusic = currentMusic || defaultMusic;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Navigation */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/music')}
                className="text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Music
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>

            {/* Music Info */}
            <div className="text-center">
              <h1 className="text-xl font-bold text-white flex items-center justify-center">
                <Music className="w-5 h-5 mr-2" />
                {displayMusic.title}
              </h1>
              <p className="text-gray-300">{displayMusic.artist}</p>
              {displayMusic._id === 'default' && (
                <p className="text-yellow-400 text-sm">🎵 Enhanced Practice Track</p>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-300">{user?.username}</div>
                <div className="text-xs text-yellow-400 flex items-center">
                  <Coins className="w-3 h-3 mr-1" />
                  {formatNumber(user?.coins?.available || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="container mx-auto px-4 py-6">
        <GameStage className="mb-6" />
        
        {/* Enhanced Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{formatNumber(score.current)}</div>
            <div className="text-xs text-gray-400">Total Score</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-green-400">{stats.totalKeys}</div>
            <div className="text-xs text-gray-400">Keys Hit</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{stats.keysPerMinute}</div>
            <div className="text-xs text-gray-400">Keys/Min</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-orange-400">{stats.accuracy}%</div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">{formatTime(progress.currentTime)}</div>
            <div className="text-xs text-gray-400">Time</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-red-400">{Math.floor(progress.progress)}%</div>
            <div className="text-xs text-gray-400">Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        {isGameActive() && (
          <div className="mb-6">
            <div className="bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full"
                style={{ width: `${progress.progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(progress.currentTime)}</span>
              <span>{formatTime(progress.timeRemaining)}</span>
            </div>
          </div>
        )}

        {/* Game Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          {gameState === GAME_STATES.IDLE && (
            <Button
              onClick={handleStartGame}
              loading={isStarting}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Enhanced Game
            </Button>
          )}

          {gameState === GAME_STATES.COMPLETED && (
            <Button
              onClick={handlePlayAgain}
              loading={isStarting}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Again
            </Button>
          )}  
          
          {(isGameActive() || isGamePaused()) && (
            <>
              <Button onClick={handlePauseResume} variant="outline" size="lg">
                {isGameActive() ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={handleEndGame}
                loading={isEnding}
                variant="outline"
                size="lg"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <Square className="w-5 h-5 mr-2" />
                End Game
              </Button>
            </>
          )}
          
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="lg"
          >
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={toggleMute}
            variant="outline"
            size="lg"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>

          {/* Toggle Notation Button */}
          <Button
            onClick={() => setGameSettings(prev => ({ ...prev, showNotation: !prev.showNotation }))}
            variant="outline"
            size="lg"
            title="Toggle Music Notation"
          >
            {gameSettings.showNotation ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>
        </div>

        {/* Enhanced Piano Interface - CHỈ 1 COMPONENT DUY NHẤT */}
        <div className="relative">
          <div className={`max-w-7xl mx-auto ${
            gameSettings.pianoSize === 'small' ? 'scale-75' : 
            gameSettings.pianoSize === 'large' ? 'scale-110' : 'scale-100'
          } transition-transform duration-300`}>
            <GamePiano
              onKeystroke={handleKeystroke}
              gameState={gameState}
              showGuide={gameSettings.showKeyGuide}
              showNotation={gameSettings.showNotation}
            />
          </div>
        </div>

        {/* Enhanced Help Text */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-400 text-sm">
            🎹 Use keyboard keys to play the enhanced 3-octave piano! Each key press = 10+ points
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Octave 3 (Q-U, 1-5)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Octave 4 (A-J, 6-0)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Octave 5 (Z-M, I-L)</span>
            </div>
          </div>
          {displayMusic._id === 'default' && (
            <p className="text-yellow-400 text-sm mt-2">
              🎵 Playing default enhanced track. <button 
                onClick={() => navigate('/music')} 
                className="underline hover:no-underline"
              >
                Browse music library
              </button> to choose a different song.
            </p>
          )}
          
          {gameSettings.showNotation && (
            <p className="text-blue-400 text-sm">
              🎼 Watch the musical notation above to see your notes moving from right to left!
            </p>
          )}
        </div>

        {/* Piano Size Controls */}
        <div className="flex justify-center mt-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3">
            <span className="text-gray-400 text-sm">Piano Size:</span>
            <div className="flex space-x-1">
              {['small', 'normal', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => setGameSettings(prev => ({ ...prev, pianoSize: size }))}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    gameSettings.pianoSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      <GameSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleUpdateSettings}
      />
      
      <GameResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        onPlayAgain={handlePlayAgain}
        onClaimRewards={handleClaimRewards}
      />
    </div>
  );
};

export default GamePage;