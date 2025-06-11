// client/src/contexts/GameContext.jsx - Game state management context
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { gameService } from '../services/gameService';
import { socketService } from '../services/socketService';
// Game Context
const GameContext = createContext();

// Game States
const GAME_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Game Actions
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
  UPDATE_MULTIPLIERS: 'UPDATE_MULTIPLIERS'
};

// Initial State
const initialState = {
  // Game Status
  gameState: GAME_STATES.IDLE,
  sessionId: null,
  isLoading: false,
  error: null,

  // Music & Settings
  currentMusic: null,
  gameSettings: {
    difficulty: 'easy',
    speed: 1.0,
    autoPlay: false,
    soundEnabled: true,
    visualEffects: true
  },

  // Game Progress
  startTime: null,
  currentTime: 0,
  progress: 0,
  duration: 0,

  // Scoring
  score: {
    current: 0,
    base: 0,
    bonus: 0,
    multiplier: 1.0,
    combo: 0,
    maxCombo: 0
  },

  // Gameplay Stats
  stats: {
    totalNotes: 0,
    correctNotes: 0,
    missedNotes: 0,
    perfectHits: 0,
    goodHits: 0,
    accuracy: 0,
    streak: 0
  },

  // Keystrokes & Input
  keystrokes: [],
  activeKeys: new Set(),
  recentKeystrokes: [],

  // Rewards & Achievements
  rewards: {
    coins: 0,
    experience: 0,
    bonusCoins: 0
  },
  achievements: [],
  recentAchievements: [],

  // Visual Effects
  effects: {
    particles: [],
    animations: [],
    feedback: []
  },

  // Performance
  performance: {
    fps: 60,
    latency: 0,
    dropped: 0
  }
};

// Game Reducer
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
        score: initialState.score,
        stats: initialState.stats,
        keystrokes: [],
        achievements: [],
        effects: initialState.effects
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
      
      // Update stats based on keystroke
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
      return {
        ...state,
        gameState: GAME_STATES.COMPLETED,
        rewards: action.payload.rewards || state.rewards,
        achievements: [...state.achievements, ...(action.payload.achievements || [])]
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

// Game Provider Component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Start Game Mutation
  const startGameMutation = useMutation(gameService.startGame, {
    onMutate: () => {
      dispatch({ type: GAME_ACTIONS.SET_STATE, payload: GAME_STATES.LOADING });
    },
    onSuccess: (response) => {
      const { game } = response;
      dispatch({
        type: GAME_ACTIONS.START_GAME,
        payload: {
          sessionId: game.sessionId
        }
      });
      
      // Join socket room
      if (socketService.isConnected()) {
        socketService.joinGame(game.sessionId);
      }
      
      toast.success('Game started!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to start game';
      dispatch({
        type: GAME_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      toast.error(errorMessage);
    }
  });

  // End Game Mutation
  const endGameMutation = useMutation(gameService.endGame, {
    onSuccess: (response) => {
      dispatch({
        type: GAME_ACTIONS.END_GAME,
        payload: response.results
      });
      queryClient.invalidateQueries(['userStats', 'balance']);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to end game';
      dispatch({
        type: GAME_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
    }
  });

  // Claim Rewards Mutation
  const claimRewardsMutation = useMutation(gameService.claimRewards, {
    onSuccess: (response) => {
      toast.success(`Claimed ${response.rewards.coins} BigCoins!`);
      queryClient.invalidateQueries(['balance', 'userStats']);
    },
    onError: (error) => {
      toast.error('Failed to claim rewards');
    }
  });

  // Game Actions
  const startGame = useCallback(async (musicId, settings = {}) => {
    if (!isAuthenticated) {
      toast.error('Please login to play');
      return;
    }

    const gameSettings = {
      ...state.gameSettings,
      ...settings
    };

    dispatch({
      type: GAME_ACTIONS.SET_SETTINGS,
      payload: gameSettings
    });

    return startGameMutation.mutateAsync({
      musicId,
      settings: gameSettings
    });
  }, [isAuthenticated, state.gameSettings, startGameMutation]);

  const pauseGame = useCallback(() => {
    if (state.gameState === GAME_STATES.PLAYING) {
      dispatch({ type: GAME_ACTIONS.PAUSE_GAME });
      
      if (state.sessionId) {
        gameService.pauseGame(state.sessionId);
      }
    }
  }, [state.gameState, state.sessionId]);

  const resumeGame = useCallback(() => {
    if (state.gameState === GAME_STATES.PAUSED) {
      dispatch({ type: GAME_ACTIONS.RESUME_GAME });
      
      if (state.sessionId) {
        gameService.resumeGame(state.sessionId);
      }
    }
  }, [state.gameState, state.sessionId]);

  const endGame = useCallback(async () => {
    if (state.sessionId && state.gameState === GAME_STATES.PLAYING) {
      return endGameMutation.mutateAsync(state.sessionId);
    }
  }, [state.sessionId, state.gameState, endGameMutation]);

  const processKeystroke = useCallback(async (keystrokeData) => {
    if (state.gameState !== GAME_STATES.PLAYING || !state.sessionId) return;

    try {
      // Add keystroke locally for immediate feedback
      dispatch({
        type: GAME_ACTIONS.ADD_KEYSTROKE,
        payload: keystrokeData
      });

      // Send to server
      const response = await gameService.processKeystroke(state.sessionId, keystrokeData);
      
      // Update score and combo
      dispatch({
        type: GAME_ACTIONS.UPDATE_SCORE,
        payload: {
          current: response.totalScore,
          base: response.points
        }
      });

      dispatch({
        type: GAME_ACTIONS.UPDATE_COMBO,
        payload: response.combo
      });

      // Send via socket for multiplayer
      if (socketService.isConnected()) {
        socketService.sendKeystroke({
          sessionId: state.sessionId,
          ...keystrokeData
        });
      }

      return response;
    } catch (error) {
      console.error('Keystroke processing error:', error);
    }
  }, [state.gameState, state.sessionId]);

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

  const claimRewards = useCallback(async () => {
    if (state.sessionId && state.gameState === GAME_STATES.COMPLETED) {
      return claimRewardsMutation.mutateAsync(state.sessionId);
    }
  }, [state.sessionId, state.gameState, claimRewardsMutation]);

  const updateProgress = useCallback((currentTime, duration) => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    dispatch({
      type: GAME_ACTIONS.UPDATE_PROGRESS,
      payload: { currentTime, progress }
    });
  }, []);

  // Socket Event Handlers
  useEffect(() => {
    if (!socketService.isConnected()) return;

    const handleGameJoined = (data) => {
      console.log('Game joined:', data);
    };

    const handleGameError = (error) => {
      dispatch({
        type: GAME_ACTIONS.SET_ERROR,
        payload: error.message
      });
      toast.error(error.message);
    };

    const handlePlayerKeystroke = (data) => {
      // Handle multiplayer keystroke events
      console.log('Player keystroke:', data);
    };

    socketService.on('game_joined', handleGameJoined);
    socketService.on('game_error', handleGameError);
    socketService.on('player_keystroke', handlePlayerKeystroke);

    return () => {
      socketService.off('game_joined', handleGameJoined);
      socketService.off('game_error', handleGameError);
      socketService.off('player_keystroke', handlePlayerKeystroke);
    };
  }, []);

  // Game Timer
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

  // Helper Functions
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

  // Context Value
  const value = {
    // State
    ...state,
    
    // Actions
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
    
    // Helpers
    isGameActive,
    isGamePaused,
    isGameCompleted,
    getGameProgress,
    
    // Loading States
    isStarting: startGameMutation.isLoading,
    isEnding: endGameMutation.isLoading,
    isClaiming: claimRewardsMutation.isLoading
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom Hook
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { GAME_STATES };
export default GameContext;