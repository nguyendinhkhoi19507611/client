// src/contexts/GameContext.jsx - Updated with continuous scoring
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

const GameContext = createContext();

const GAME_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ERROR: 'error'
};

const GAME_ACTIONS = {
  SET_STATE: 'SET_STATE',
  SET_MUSIC: 'SET_MUSIC',
  SET_SETTINGS: 'SET_SETTINGS',
  START_GAME: 'START_GAME',
  UPDATE_SCORE: 'UPDATE_SCORE',
  ADD_KEYSTROKE: 'ADD_KEYSTROKE',
  UPDATE_COMBO: 'UPDATE_COMBO',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  END_GAME: 'END_GAME',
  RESET_GAME: 'RESET_GAME',
  SET_ERROR: 'SET_ERROR',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  CLAIM_REWARDS: 'CLAIM_REWARDS',
  UPDATE_STATS: 'UPDATE_STATS'
};

const initialState = {
  gameState: GAME_STATES.IDLE,
  sessionId: null,
  isLoading: false,
  error: null,

  currentMusic: null,
  gameSettings: {
    soundEnabled: true,
    visualEffects: true,
    showNotes: true,
    showKeyboard: true
  },

  startTime: null,
  currentTime: 0,
  progress: 0,
  duration: 0,

  score: {
    current: 0,
    combo: 0,
    maxCombo: 0,
    multiplier: 1
  },

  stats: {
    totalKeys: 0,
    keysPerMinute: 0,
    accuracy: 100,
    perfectHits: 0,
    goodHits: 0,
    missedHits: 0
  },

  keystrokes: [],
  recentKeystrokes: [],

  rewards: {
    coins: 0,
    experience: 0,
    bonusCoins: 0,
    claimed: false
  }
};

// Enhanced mock music database
const mockMusicLibrary = [
  {
    _id: '1',
    title: 'Für Elise',
    artist: 'Beethoven',
    genre: 'classical',
    duration: 180,
    statistics: {
      playCount: 25600,
      averageScore: 7800
    },
    trending: true,
    featured: true,
    tags: ['classical', 'popular']
  },
  {
    _id: '2',
    title: 'Canon in D',
    artist: 'Pachelbel',
    genre: 'classical',
    duration: 240,
    statistics: {
      playCount: 18900,
      averageScore: 9200
    },
    featured: true,
    tags: ['classical', 'wedding']
  },
  {
    _id: '3',
    title: 'Moonlight Sonata',
    artist: 'Beethoven',
    genre: 'classical',
    duration: 300,
    statistics: {
      playCount: 12400,
      averageScore: 11500
    },
    tags: ['classical', 'dramatic']
  },
  {
    _id: '4',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    genre: 'pop',
    duration: 233,
    statistics: {
      playCount: 45600,
      averageScore: 6800
    },
    trending: true,
    tags: ['pop', 'modern']
  },
  {
    _id: '5',
    title: 'Someone Like You',
    artist: 'Adele',
    genre: 'pop',
    duration: 285,
    statistics: {
      playCount: 38200,
      averageScore: 8400
    },
    featured: true,
    tags: ['pop', 'ballad']
  },
  {
    _id: '6',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    genre: 'rock',
    duration: 355,
    statistics: {
      playCount: 21500,
      averageScore: 14200
    },
    trending: true,
    featured: true,
    tags: ['rock', 'epic']
  },
  {
    _id: '7',
    title: 'Hotel California',
    artist: 'Eagles',
    genre: 'rock',
    duration: 391,
    statistics: {
      playCount: 19300,
      averageScore: 10800
    },
    tags: ['rock', 'classic']
  },
  {
    _id: '8',
    title: 'Imagine',
    artist: 'John Lennon',
    genre: 'pop',
    duration: 183,
    statistics: {
      playCount: 41200,
      averageScore: 7200
    },
    trending: true,
    tags: ['pop', 'peace']
  }
];

const gameReducer = (state, action) => {
  switch (action.type) {
    case GAME_ACTIONS.SET_STATE:
      return {
        ...state,
        gameState: action.payload,
        error: action.payload === GAME_STATES.ERROR ? state.error : null
      };

    case GAME_ACTIONS.SET_MUSIC:
      return {
        ...state,
        currentMusic: action.payload,
        duration: action.payload?.duration || 0
      };

    case GAME_ACTIONS.SET_SETTINGS:
      return {
        ...state,
        gameSettings: {
          ...state.gameSettings,
          ...action.payload
        }
      };

    case GAME_ACTIONS.START_GAME:
      return {
        ...state,
        gameState: GAME_STATES.PLAYING,
        sessionId: action.payload.sessionId,
        startTime: new Date(),
        currentTime: 0,
        progress: 0,
        score: { ...initialState.score },
        stats: { ...initialState.stats },
        keystrokes: [],
        recentKeystrokes: [],
        rewards: { ...initialState.rewards }
      };

    case GAME_ACTIONS.UPDATE_SCORE:
      return {
        ...state,
        score: {
          ...state.score,
          ...action.payload
        }
      };

    case GAME_ACTIONS.ADD_KEYSTROKE:
      const keystroke = action.payload;
      const newKeystrokes = [...state.keystrokes, keystroke];
      const recentKeystrokes = [...state.recentKeystrokes, keystroke].slice(-10);
      
      return {
        ...state,
        keystrokes: newKeystrokes,
        recentKeystrokes
      };

    case GAME_ACTIONS.UPDATE_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        }
      };

    case GAME_ACTIONS.UPDATE_COMBO:
      return {
        ...state,
        score: {
          ...state.score,
          combo: action.payload,
          maxCombo: Math.max(state.score.maxCombo, action.payload),
          multiplier: Math.floor(action.payload / 10) + 1 // Increase multiplier every 10 combo
        }
      };

    case GAME_ACTIONS.PAUSE_GAME:
      return {
        ...state,
        gameState: GAME_STATES.PAUSED
      };

    case GAME_ACTIONS.RESUME_GAME:
      return {
        ...state,
        gameState: GAME_STATES.PLAYING
      };

    case GAME_ACTIONS.END_GAME:
      const finalRewards = calculateRewards(state);
      return {
        ...state,
        gameState: GAME_STATES.COMPLETED,
        rewards: finalRewards
      };

    case GAME_ACTIONS.CLAIM_REWARDS:
      return {
        ...state,
        rewards: {
          ...state.rewards,
          claimed: true
        }
      };

    case GAME_ACTIONS.RESET_GAME:
      return {
        ...initialState,
        gameSettings: state.gameSettings
      };

    case GAME_ACTIONS.SET_ERROR:
      return {
        ...state,
        gameState: GAME_STATES.ERROR,
        error: action.payload,
        isLoading: false
      };

    case GAME_ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        currentTime: action.payload.currentTime,
        progress: action.payload.progress
      };

    default:
      return state;
  }
};

// Enhanced reward calculation
const calculateRewards = (state) => {
  const baseCoins = Math.floor(state.score.current * 0.01);
  const comboBonus = state.score.maxCombo >= 100 ? 50 : 
                    state.score.maxCombo >= 50 ? 25 : 
                    state.score.maxCombo >= 25 ? 10 : 0;
  const accuracyBonus = state.stats.accuracy >= 95 ? 20 : 
                       state.stats.accuracy >= 85 ? 10 : 0;
  
  return {
    coins: baseCoins,
    experience: Math.floor(state.score.current * 0.1),
    bonusCoins: comboBonus + accuracyBonus,
    claimed: false
  };
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();

  // Start game function
  const startGame = useCallback(async (musicId, settings = {}) => {
    if (!user) {
      toast.error(t('errors.permissionDenied'));
      return;
    }

    dispatch({ type: GAME_ACTIONS.SET_STATE, payload: GAME_STATES.LOADING });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const gameSettings = {
      ...state.gameSettings,
      ...settings
    };

    dispatch({
      type: GAME_ACTIONS.SET_SETTINGS,
      payload: gameSettings
    });

    const sessionId = Date.now().toString();
    dispatch({
      type: GAME_ACTIONS.START_GAME,
      payload: { sessionId }
    });

    toast.success(t('game.startGame'));
  }, [user, state.gameSettings, t]);

  const pauseGame = useCallback(() => {
    if (state.gameState === GAME_STATES.PLAYING) {
      dispatch({ type: GAME_ACTIONS.PAUSE_GAME });
      toast.info(t('game.pauseGame'));
    }
  }, [state.gameState, t]);

  const resumeGame = useCallback(() => {
    if (state.gameState === GAME_STATES.PAUSED) {
      dispatch({ type: GAME_ACTIONS.RESUME_GAME });
      toast.success(t('game.resumeGame'));
    }
  }, [state.gameState, t]);

  const endGame = useCallback(async () => {
    if (state.sessionId && state.gameState === GAME_STATES.PLAYING) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({
        type: GAME_ACTIONS.END_GAME,
        payload: {}
      });

      toast.success(t('game.gameComplete'));
    }
  }, [state.sessionId, state.gameState, t]);

  // Enhanced keystroke processing with continuous scoring
  const processKeystroke = useCallback(async (keystrokeData) => {
    if (state.gameState !== GAME_STATES.PLAYING || !state.sessionId) return;

    // Add keystroke to history
    dispatch({
      type: GAME_ACTIONS.ADD_KEYSTROKE,
      payload: keystrokeData
    });

    // Calculate points with combo bonus and multiplier
    const basePoints = keystrokeData.points || 10;
    const comboMultiplier = Math.floor(state.score.combo / 10) + 1;
    const totalPoints = basePoints * comboMultiplier * state.score.multiplier;

    // Update score immediately
    dispatch({
      type: GAME_ACTIONS.UPDATE_SCORE,
      payload: {
        current: state.score.current + totalPoints
      }
    });

    // Update combo (increment on each key press)
    const newCombo = state.score.combo + 1;
    dispatch({
      type: GAME_ACTIONS.UPDATE_COMBO,
      payload: newCombo
    });

    // Update stats
    const newStats = {
      totalKeys: state.stats.totalKeys + 1,
      perfectHits: state.stats.perfectHits + (keystrokeData.accuracy === 'perfect' ? 1 : 0),
      goodHits: state.stats.goodHits + (keystrokeData.accuracy === 'good' ? 1 : 0)
    };

    // Calculate keys per minute
    if (state.startTime) {
      const timeElapsed = (Date.now() - state.startTime.getTime()) / 1000 / 60;
      newStats.keysPerMinute = Math.round(newStats.totalKeys / Math.max(timeElapsed, 0.1));
    }

    // Calculate accuracy
    const totalHits = newStats.perfectHits + newStats.goodHits + newStats.missedHits;
    newStats.accuracy = totalHits > 0 ? 
      Math.round(((newStats.perfectHits + newStats.goodHits) / totalHits) * 100) : 100;

    dispatch({
      type: GAME_ACTIONS.UPDATE_STATS,
      payload: newStats
    });

    // Visual feedback for scoring
    if (typeof window !== 'undefined') {
      const scoreElement = document.createElement('div');
      scoreElement.innerHTML = `+${totalPoints}`;
      scoreElement.className = 'floating-score';
      scoreElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: ${newCombo >= 50 ? '#f59e0b' : '#10b981'};
        font-size: ${Math.min(24 + Math.floor(newCombo / 10), 36)}px;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
        animation: scoreFloat 1s ease-out forwards;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      `;
      
      // Add animation if not exists
      if (!document.querySelector('#scoreFloatStyle')) {
        const style = document.createElement('style');
        style.id = 'scoreFloatStyle';
        style.innerHTML = `
          @keyframes scoreFloat {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -100%) scale(1.1); }
            100% { opacity: 0; transform: translate(-50%, -150%) scale(1.2); }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(scoreElement);
      setTimeout(() => {
        if (scoreElement.parentNode) {
          scoreElement.remove();
        }
      }, 1000);
    }

    // Combo milestone notifications
    if (newCombo > 0 && newCombo % 25 === 0) {
      toast.success(`🔥 ${newCombo} Combo! Amazing!`, {
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white'
        }
      });
    }

    return {
      totalScore: state.score.current + totalPoints,
      points: totalPoints,
      combo: newCombo,
      multiplier: comboMultiplier
    };
  }, [state.gameState, state.sessionId, state.score, state.stats, state.startTime]);

  const claimRewards = useCallback(async () => {
    if (state.sessionId && state.gameState === GAME_STATES.COMPLETED && !state.rewards.claimed) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentCoins = user?.coins?.available || 0;
      const totalReward = state.rewards.coins + state.rewards.bonusCoins;
      
      await updateProfile({
        coins: {
          ...user.coins,
          available: currentCoins + totalReward,
          total: (user.coins?.total || 0) + totalReward,
          earned: (user.coins?.earned || 0) + totalReward
        },
        statistics: {
          ...user.statistics,
          totalGames: (user.statistics?.totalGames || 0) + 1,
          bestScore: Math.max(user.statistics?.bestScore || 0, state.score.current),
          experience: (user.statistics?.experience || 0) + state.rewards.experience,
          accuracy: Math.max(user.statistics?.accuracy || 0, state.stats.accuracy)
        }
      });

      dispatch({ type: GAME_ACTIONS.CLAIM_REWARDS });
      
      return {
        rewards: {
          coins: totalReward,
          experience: state.rewards.experience
        }
      };
    }
  }, [state.sessionId, state.gameState, state.rewards, state.score.current, state.stats.accuracy, user, updateProfile]);

  const resetGame = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.RESET_GAME });
  }, []);

  const setMusic = useCallback((music) => {
    dispatch({
      type: GAME_ACTIONS.SET_MUSIC,
      payload: music
    });
  }, []);

  const updateSettings = useCallback((settings) => {
    dispatch({
      type: GAME_ACTIONS.SET_SETTINGS,
      payload: settings
    });
  }, []);

  const updateProgress = useCallback((currentTime, duration) => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    dispatch({
      type: GAME_ACTIONS.UPDATE_PROGRESS,
      payload: { currentTime, progress }
    });
  }, []);

  // Game timer with auto-completion
  useEffect(() => {
    if (state.gameState !== GAME_STATES.PLAYING || !state.startTime) return;

    const timer = setInterval(() => {
      const currentTime = (Date.now() - state.startTime.getTime()) / 1000;
      updateProgress(currentTime, state.duration);
      
      // Auto-complete game after duration (if set) or after 5 minutes
      const maxDuration = state.duration || 300; // 5 minutes default
      if (currentTime >= maxDuration) {
        endGame();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [state.gameState, state.startTime, state.duration, updateProgress, endGame]);

  // Helper functions
  const isGameActive = useCallback(() => {
    return state.gameState === GAME_STATES.PLAYING;
  }, [state.gameState]);

  const isGamePaused = useCallback(() => {
    return state.gameState === GAME_STATES.PAUSED;
  }, [state.gameState]);

  const isGameCompleted = useCallback(() => {
    return state.gameState === GAME_STATES.COMPLETED;
  }, [state.gameState]);

  const getGameProgress = useCallback(() => {
    return {
      progress: state.progress,
      currentTime: state.currentTime,
      duration: state.duration,
      timeRemaining: Math.max(0, state.duration - state.currentTime)
    };
  }, [state.progress, state.currentTime, state.duration]);

  // Music library functions
  const getMusicById = useCallback((id) => {
    return mockMusicLibrary.find(m => m._id === id) || null;
  }, []);

  const searchMusic = useCallback((params) => {
    let results = [...mockMusicLibrary];
    
    if (params.q) {
      results = results.filter(m => 
        m.title.toLowerCase().includes(params.q.toLowerCase()) ||
        m.artist.toLowerCase().includes(params.q.toLowerCase())
      );
    }
    
    return { music: results, total: results.length };
  }, []);

  const getFeaturedMusic = useCallback(() => {
    return mockMusicLibrary.filter(m => m.featured);
  }, []);

  const getTrendingMusic = useCallback(() => {
    return mockMusicLibrary.filter(m => m.trending);
  }, []);

  const getMusicByGenre = useCallback((genre) => {
    return mockMusicLibrary.filter(m => m.genre === genre);
  }, []);

  const getRecommendedMusic = useCallback(() => {
    return mockMusicLibrary
      .sort((a, b) => b.statistics.playCount - a.statistics.playCount)
      .slice(0, 10);
  }, []);

  const value = {
    ...state,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    processKeystroke,
    setMusic,
    updateSettings,
    claimRewards,
    updateProgress,
    isGameActive,
    isGamePaused,
    isGameCompleted,
    getGameProgress,
    getMusicById,
    searchMusic,
    getFeaturedMusic,
    getTrendingMusic,
    getMusicByGenre,
    getRecommendedMusic,
    mockMusic: mockMusicLibrary,
    isStarting: false,
    isEnding: false,
    isClaiming: false
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { GAME_STATES };
export default GameContext;