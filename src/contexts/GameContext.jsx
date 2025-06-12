// Game state management context with mock data
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

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
  ADD_ACHIEVEMENT: 'ADD_ACHIEVEMENT',
  UPDATE_MULTIPLIERS: 'UPDATE_MULTIPLIERS',
  CLAIM_REWARDS: 'CLAIM_REWARDS'
};

const initialState = {
  gameState: GAME_STATES.IDLE,
  sessionId: null,
  isLoading: false,
  error: null,

  currentMusic: null,
  gameSettings: {
    difficulty: 'easy',
    speed: 1.0,
    autoPlay: false,
    soundEnabled: true,
    visualEffects: true
  },

  startTime: null,
  currentTime: 0,
  progress: 0,
  duration: 0,

  score: {
    current: 0,
    base: 0,
    bonus: 0,
    multiplier: 1.0,
    combo: 0,
    maxCombo: 0
  },

  stats: {
    totalNotes: 0,
    correctNotes: 0,
    missedNotes: 0,
    perfectHits: 0,
    goodHits: 0,
    accuracy: 0,
    streak: 0
  },

  keystrokes: [],
  activeKeys: new Set(),
  recentKeystrokes: [],

  rewards: {
    coins: 0,
    experience: 0,
    bonusCoins: 0,
    claimed: false
  },
  achievements: [],
  recentAchievements: [],

  effects: {
    particles: [],
    animations: [],
    feedback: []
  },

  performance: {
    fps: 60,
    latency: 0,
    dropped: 0
  }
};

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
        score: { ...initialState.score, multiplier: state.gameSettings.difficulty === 'expert' ? 2.0 : 1.0 },
        stats: initialState.stats,
        keystrokes: [],
        achievements: [],
        effects: initialState.effects,
        rewards: { ...initialState.rewards }
      };

    case GAME_ACTIONS.UPDATE_SCORE:
      const newScore = {
        ...state.score,
        ...action.payload
      };
      newScore.current = newScore.base + newScore.bonus;
      
      return {
        ...state,
        score: newScore
      };

    case GAME_ACTIONS.ADD_KEYSTROKE:
      const keystroke = action.payload;
      const newKeystrokes = [...state.keystrokes, keystroke];
      const recentKeystrokes = [...state.recentKeystrokes, keystroke].slice(-10);
      
      const updatedStats = { ...state.stats };
      updatedStats.totalNotes += 1;
      
      if (keystroke.accuracy === 'perfect') {
        updatedStats.perfectHits += 1;
        updatedStats.correctNotes += 1;
        updatedStats.streak += 1;
      } else if (keystroke.accuracy === 'good') {
        updatedStats.goodHits += 1;
        updatedStats.correctNotes += 1;
        updatedStats.streak += 1;
      } else {
        updatedStats.missedNotes += 1;
        updatedStats.streak = 0;
      }
      
      updatedStats.accuracy = updatedStats.totalNotes > 0 
        ? (updatedStats.correctNotes / updatedStats.totalNotes) * 100 
        : 0;
      
      return {
        ...state,
        keystrokes: newKeystrokes,
        recentKeystrokes,
        stats: updatedStats
      };

    case GAME_ACTIONS.UPDATE_COMBO:
      return {
        ...state,
        score: {
          ...state.score,
          combo: action.payload,
          maxCombo: Math.max(state.score.maxCombo, action.payload)
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
      const finalRewards = {
        coins: Math.floor(state.score.current * 0.01), // 1 coin per 100 points
        experience: Math.floor(state.score.current * 0.1),
        bonusCoins: state.score.maxCombo >= 50 ? 10 : 0,
        claimed: false
      };

      return {
        ...state,
        gameState: GAME_STATES.COMPLETED,
        rewards: finalRewards,
        achievements: [...state.achievements, ...(action.payload.achievements || [])]
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

    case GAME_ACTIONS.ADD_ACHIEVEMENT:
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
        recentAchievements: [...state.recentAchievements, action.payload]
      };

    case GAME_ACTIONS.UPDATE_MULTIPLIERS:
      return {
        ...state,
        score: {
          ...state.score,
          multiplier: action.payload
        }
      };

    default:
      return state;
  }
};

// Mock music database
const mockMusic = [
  {
    _id: '1',
    title: 'Für Elise',
    artist: 'Beethoven',
    genre: 'classical',
    difficulty: { level: 'medium' },
    duration: 180,
    statistics: {
      playCount: 12500,
      averageScore: 8500,
      averageAccuracy: 85.2
    },
    availability: { premium: false },
    sheet: {
      notes: [
        { note: 'E5', time: 1000, duration: 500 },
        { note: 'D#5', time: 1500, duration: 500 },
        { note: 'E5', time: 2000, duration: 500 },
        { note: 'D#5', time: 2500, duration: 500 },
        { note: 'E5', time: 3000, duration: 500 },
        { note: 'B4', time: 3500, duration: 500 },
        { note: 'D5', time: 4000, duration: 500 },
        { note: 'C5', time: 4500, duration: 500 },
        { note: 'A4', time: 5000, duration: 1000 }
      ]
    }
  },
  {
    _id: '2',
    title: 'Canon in D',
    artist: 'Pachelbel',
    genre: 'classical',
    difficulty: { level: 'hard' },
    duration: 240,
    statistics: {
      playCount: 8200,
      averageScore: 9200,
      averageAccuracy: 78.9
    },
    availability: { premium: false }
  },
  {
    _id: '3',
    title: 'Moonlight Sonata',
    artist: 'Beethoven',
    genre: 'classical',
    difficulty: { level: 'expert' },
    duration: 300,
    statistics: {
      playCount: 5600,
      averageScore: 12000,
      averageAccuracy: 72.1
    },
    availability: { premium: true }
  }
];

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user, updateProfile } = useAuth();

  // Mock start game function
  const startGame = useCallback(async (musicId, settings = {}) => {
    if (!user) {
      toast.error('Please login to play');
      return;
    }

    dispatch({ type: GAME_ACTIONS.SET_STATE, payload: GAME_STATES.LOADING });

    // Simulate loading delay
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

    toast.success('Game started!');
  }, [user, state.gameSettings]);

  const pauseGame = useCallback(() => {
    if (state.gameState === GAME_STATES.PLAYING) {
      dispatch({ type: GAME_ACTIONS.PAUSE_GAME });
    }
  }, [state.gameState]);

  const resumeGame = useCallback(() => {
    if (state.gameState === GAME_STATES.PAUSED) {
      dispatch({ type: GAME_ACTIONS.RESUME_GAME });
    }
  }, [state.gameState]);

  const endGame = useCallback(async () => {
    if (state.sessionId && state.gameState === GAME_STATES.PLAYING) {
      // Simulate ending delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({
        type: GAME_ACTIONS.END_GAME,
        payload: { achievements: [] }
      });
    }
  }, [state.sessionId, state.gameState]);

  const processKeystroke = useCallback(async (keystrokeData) => {
    if (state.gameState !== GAME_STATES.PLAYING || !state.sessionId) return;

    // Add keystroke locally for immediate feedback
    dispatch({
      type: GAME_ACTIONS.ADD_KEYSTROKE,
      payload: keystrokeData
    });

    // Calculate score based on accuracy
    let points = 0;
    if (keystrokeData.accuracy === 'perfect') {
      points = 100 * state.score.multiplier;
    } else if (keystrokeData.accuracy === 'good') {
      points = 50 * state.score.multiplier;
    }

    // Update score
    dispatch({
      type: GAME_ACTIONS.UPDATE_SCORE,
      payload: {
        base: state.score.base + points
      }
    });

    // Update combo
    const newCombo = keystrokeData.accuracy !== 'miss' ? state.score.combo + 1 : 0;
    dispatch({
      type: GAME_ACTIONS.UPDATE_COMBO,
      payload: newCombo
    });

    return {
      totalScore: state.score.current + points,
      points,
      combo: newCombo
    };
  }, [state.gameState, state.sessionId, state.score]);

  const claimRewards = useCallback(async () => {
    if (state.sessionId && state.gameState === GAME_STATES.COMPLETED && !state.rewards.claimed) {
      // Simulate claiming delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user coins
      const currentCoins = user?.coins?.available || 0;
      const totalReward = state.rewards.coins + state.rewards.bonusCoins;
      
      await updateProfile({
        coins: {
          ...user.coins,
          available: currentCoins + totalReward,
          total: (user.coins?.total || 0) + totalReward
        },
        statistics: {
          ...user.statistics,
          totalGames: (user.statistics?.totalGames || 0) + 1,
          bestScore: Math.max(user.statistics?.bestScore || 0, state.score.current),
          experience: (user.statistics?.experience || 0) + state.rewards.experience
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
  }, [state.sessionId, state.gameState, state.rewards, user, updateProfile]);

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

  // Game timer
  useEffect(() => {
    if (state.gameState !== GAME_STATES.PLAYING || !state.startTime) return;

    const timer = setInterval(() => {
      const currentTime = (Date.now() - state.startTime.getTime()) / 1000;
      updateProgress(currentTime, state.duration);
      
      // Auto-end game when duration reached
      if (state.duration > 0 && currentTime >= state.duration) {
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

  // Mock functions to get music data
  const getMusicById = useCallback((id) => {
    return mockMusic.find(m => m._id === id) || null;
  }, []);

  const searchMusic = useCallback((params) => {
    let results = [...mockMusic];
    
    if (params.q) {
      results = results.filter(m => 
        m.title.toLowerCase().includes(params.q.toLowerCase()) ||
        m.artist.toLowerCase().includes(params.q.toLowerCase())
      );
    }
    
    if (params.genres && params.genres.length > 0) {
      results = results.filter(m => params.genres.includes(m.genre));
    }
    
    if (params.difficulties && params.difficulties.length > 0) {
      results = results.filter(m => params.difficulties.includes(m.difficulty.level));
    }
    
    return { music: results, total: results.length };
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
    mockMusic,
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