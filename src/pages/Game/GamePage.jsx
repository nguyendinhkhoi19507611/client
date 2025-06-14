// src/pages/Game/GamePage.jsx - Cập nhật cho nhạc mặc định
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
  Music
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

// Game Settings Modal
const GameSettingsModal = ({ isOpen, onClose, onSave }) => {
  const { gameSettings } = useGame();
  const [settings, setSettings] = useState(gameSettings);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Settings">
      <div className="space-y-6">
        {/* Audio Settings */}
        <div className="space-y-3">
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

// Game Results Modal (loại bỏ thông tin combo)
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
    if (score.current >= 1000) return { grade: 'S', color: 'text-yellow-400', desc: 'Perfect!' };
    if (score.current >= 800) return { grade: 'A', color: 'text-green-400', desc: 'Excellent!' };
    if (score.current >= 600) return { grade: 'B', color: 'text-blue-400', desc: 'Great!' };
    if (score.current >= 400) return { grade: 'C', color: 'text-orange-400', desc: 'Good!' };
    return { grade: 'D', color: 'text-red-400', desc: 'Keep trying!' };
  };

  const performance = getPerformanceGrade();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Complete!" size="lg">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                y: -100, 
                x: Math.random() * window.innerWidth,
                rotate: 0
              }}
              animate={{ 
                opacity: 0, 
                y: window.innerHeight + 100,
                rotate: 360
              }}
              transition={{ 
                duration: 3,
                delay: Math.random() * 2,
                ease: 'easeOut'
              }}
              className="absolute w-3 h-3 bg-yellow-400 rounded"
            />
          ))}
        </div>
      )}

      <div className="space-y-6">
        {/* Performance Grade */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`text-8xl font-bold ${performance.color} mb-2`}
          >
            {performance.grade}
          </motion.div>
          <p className="text-xl text-gray-300">{performance.desc}</p>
        </div>

        {/* Stats Grid - Loại bỏ combo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{formatNumber(score.current)}</div>
            <div className="text-sm text-gray-400">Score</div>
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
              Rewards
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
          
          <div className="grid grid-cols-1 gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">BigCoins:</span>
              <span className="text-yellow-400 font-medium">+{rewards.coins}</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-gray-400">Experience:</span>
              <span className="text-blue-400 font-medium">+{rewards.experience}</span>
            </div> */}
            {/* {rewards.bonusCoins > 0 && (
              <div className="flex justify-between col-span-2">
                <span className="text-gray-400">Bonus:</span>
                <span className="text-green-400 font-medium">+{rewards.bonusCoins}</span>
              </div>
            )} */}
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

  // Load music data hoặc sử dụng nhạc mặc định
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
        // Sử dụng nhạc mặc định
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

  // Start game handler - không cần music ID vì đã có nhạc mặc định
  const handleStartGame = useCallback(async () => {
    try {
      await startGame(musicId || 'default');
    } catch (error) {
      toast.error('Failed to start game');
    }
  }, [musicId, startGame]);

  // Pause/Resume game
  const handlePauseResume = useCallback(() => {
    if (isGameActive()) {
      pauseGame();
    } else if (isGamePaused()) {
      resumeGame();
    }
  }, [isGameActive, isGamePaused, pauseGame, resumeGame]);

  // End game
  const handleEndGame = useCallback(async () => {
    try {
      await endGame();
    } catch (error) {
      toast.error('Failed to end game');
    }
  }, [endGame]);

  // Claim rewards
  const handleClaimRewards = useCallback(async () => {
    try {
      await claimRewards();
      setShowResults(false);
      toast.success('Rewards claimed successfully!');
    } catch (error) {
      toast.error('Failed to claim rewards');
    }
  }, [claimRewards]);

  // Play again
  const handlePlayAgain = useCallback(() => {
    setShowResults(false);
    handleStartGame();
  }, [handleStartGame]);

  // Keystroke handler - đơn giản hóa
  const handleKeystroke = useCallback((keystrokeData) => {
    console.log('Key pressed:', keystrokeData.key, 'Points:', keystrokeData.points);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading music..." />
      </div>
    );
  }

  // Current music info (sử dụng nhạc mặc định nếu không có)
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
                <p className="text-yellow-400 text-sm">🎵 Default Practice Track</p>
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
        
        {/* Game Stats - Loại bỏ combo */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{formatNumber(score.current)}</div>
            <div className="text-xs text-gray-400">Score</div>
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
            <div className="text-2xl font-bold text-yellow-400">{formatTime(progress.currentTime)}</div>
            <div className="text-xs text-gray-400">Time</div>
          </div>
        </div>

        {/* Progress Bar */}
        {isGameActive() && (
          <div className="mb-6">
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full"
                style={{ width: `${progress.progress}%` }}
                transition={{ duration: 0.1 }}
              />
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
              Start Game
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
              Start Game
            </Button>
          )}  
          
          {(isGameActive() || isGamePaused()) && (
            <>
              {/* <Button onClick={handlePauseResume} variant="outline" size="lg">
                {isGameActive() ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button> */}
              
              <Button
                onClick={handleEndGame}
                loading={isEnding}
                variant="outline"
                size="lg"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <Square className="w-5 h-5 mr-2" />
                {/* End Game */}
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
        </div>

        {/* Piano Interface */}
        <div className="max-w-6xl mx-auto">
          <GamePiano
            onKeystroke={handleKeystroke}
            gameState={gameState}
            showGuide={true}
          />
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Use keyboard keys A-L to play piano and earn points! Each key press = 10 points
          </p>
          {displayMusic._id === 'default' && (
            <p className="text-yellow-400 text-sm mt-2">
              🎵 Playing default practice track. <button 
                onClick={() => navigate('/music')} 
                className="underline hover:no-underline"
              >
                Browse music library
              </button> to choose a different song.
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      <GameSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={updateSettings}
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