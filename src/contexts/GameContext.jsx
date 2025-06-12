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
    difficulty: 'medium',
    speed: 1.0,
    autoPlay: false,
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

// Enhanced mock music database with comprehensive song collection
const mockMusicLibrary = [
  // Classical - Beginner
  {
    _id: '1',
    title: 'Für Elise',
    artist: 'Beethoven',
    genre: 'classical',
    difficulty: { level: 'easy' },
    duration: 180,
    bpm: 72,
    key: 'A minor',
    statistics: {
      playCount: 25600,
      averageScore: 7800,
      averageAccuracy: 89.2,
      completionRate: 94.5
    },
    availability: { premium: false },
    trending: true,
    featured: true,
    tags: ['beginner', 'romantic', 'classical'],
    description: 'One of Beethoven\'s most famous piano pieces, perfect for beginners.',
    sheet: {
      notes: [
        { note: 'E5', time: 1000, duration: 500, velocity: 0.8 },
        { note: 'D#5', time: 1500, duration: 500, velocity: 0.8 },
        { note: 'E5', time: 2000, duration: 500, velocity: 0.8 },
        { note: 'D#5', time: 2500, duration: 500, velocity: 0.8 },
        { note: 'E5', time: 3000, duration: 500, velocity: 0.8 },
        { note: 'B4', time: 3500, duration: 500, velocity: 0.7 },
        { note: 'D5', time: 4000, duration: 500, velocity: 0.7 },
        { note: 'C5', time: 4500, duration: 500, velocity: 0.7 },
        { note: 'A4', time: 5000, duration: 1000, velocity: 0.6 }
      ]
    }
  },
  {
    _id: '2',
    title: 'Canon in D',
    artist: 'Pachelbel',
    genre: 'classical',
    difficulty: { level: 'medium' },
    duration: 240,
    bpm: 50,
    key: 'D major',
    statistics: {
      playCount: 18900,
      averageScore: 9200,
      averageAccuracy: 82.7,
      completionRate: 87.3
    },
    availability: { premium: false },
    featured: true,
    tags: ['wedding', 'baroque', 'peaceful'],
    description: 'A beautiful baroque masterpiece, often played at weddings.'
  },
  {
    _id: '3',
    title: 'Moonlight Sonata (1st Movement)',
    artist: 'Beethoven',
    genre: 'classical',
    difficulty: { level: 'hard' },
    duration: 300,
    bpm: 54,
    key: 'C# minor',
    statistics: {
      playCount: 12400,
      averageScore: 11500,
      averageAccuracy: 75.1,
      completionRate: 68.2
    },
    availability: { premium: true },
    tags: ['dramatic', 'romantic', 'advanced'],
    description: 'The haunting first movement of Beethoven\'s famous sonata.'
  },

  // Pop - Modern Hits
  {
    _id: '4',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    genre: 'pop',
    difficulty: { level: 'easy' },
    duration: 233,
    bpm: 96,
    key: 'C# minor',
    statistics: {
      playCount: 45600,
      averageScore: 6800,
      averageAccuracy: 91.8,
      completionRate: 96.1
    },
    availability: { premium: false },
    trending: true,
    tags: ['modern', 'catchy', 'popular'],
    description: 'Ed Sheeran\'s chart-topping hit, simplified for piano.'
  },
  {
    _id: '5',
    title: 'Someone Like You',
    artist: 'Adele',
    genre: 'pop',
    difficulty: { level: 'medium' },
    duration: 285,
    bpm: 67,
    key: 'A major',
    statistics: {
      playCount: 38200,
      averageScore: 8400,
      averageAccuracy: 86.4,
      completionRate: 89.7
    },
    availability: { premium: false },
    featured: true,
    tags: ['emotional', 'ballad', 'powerful'],
    description: 'Adele\'s emotional ballad arranged for solo piano.'
  },
  {
    _id: '6',
    title: 'All of Me',
    artist: 'John Legend',
    genre: 'pop',
    difficulty: { level: 'medium' },
    duration: 269,
    bpm: 120,
    key: 'Ab major',
    statistics: {
      playCount: 32800,
      averageScore: 7900,
      averageAccuracy: 88.1,
      completionRate: 91.3
    },
    availability: { premium: false },
    tags: ['romantic', 'wedding', 'soulful'],
    description: 'John Legend\'s romantic hit, perfect for special occasions.'
  },

  // Rock Classics
  {
    _id: '7',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    genre: 'rock',
    difficulty: { level: 'expert' },
    duration: 355,
    bpm: 72,
    key: 'Bb major',
    statistics: {
      playCount: 21500,
      averageScore: 14200,
      averageAccuracy: 69.8,
      completionRate: 45.2
    },
    availability: { premium: true },
    trending: true,
    featured: true,
    tags: ['epic', 'complex', 'legendary'],
    description: 'Queen\'s masterpiece - a challenging piano arrangement.'
  },
  {
    _id: '8',
    title: 'Hotel California',
    artist: 'Eagles',
    genre: 'rock',
    difficulty: { level: 'hard' },
    duration: 391,
    bpm: 150,
    key: 'B minor',
    statistics: {
      playCount: 19300,
      averageScore: 10800,
      averageAccuracy: 76.9,
      completionRate: 72.4
    },
    availability: { premium: true },
    tags: ['classic', 'story', 'iconic'],
    description: 'The Eagles\' timeless classic, arranged for piano.'
  },
  {
    _id: '9',
    title: 'Imagine',
    artist: 'John Lennon',
    genre: 'rock',
    difficulty: { level: 'easy' },
    duration: 183,
    bpm: 76,
    key: 'C major',
    statistics: {
      playCount: 41200,
      averageScore: 7200,
      averageAccuracy: 93.1,
      completionRate: 97.8
    },
    availability: { premium: false },
    trending: true,
    tags: ['peaceful', 'inspiring', 'simple'],
    description: 'John Lennon\'s message of peace in a beautiful piano arrangement.'
  },

  // Jazz Standards
  {
    _id: '10',
    title: 'Autumn Leaves',
    artist: 'Traditional Jazz',
    genre: 'jazz',
    difficulty: { level: 'medium' },
    duration: 245,
    bpm: 120,
    key: 'Bb major',
    statistics: {
      playCount: 15600,
      averageScore: 8900,
      averageAccuracy: 81.4,
      completionRate: 83.7
    },
    availability: { premium: false },
    tags: ['standard', 'swing', 'sophisticated'],
    description: 'A jazz standard perfect for intermediate players.'
  },
  {
    _id: '11',
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    genre: 'jazz',
    difficulty: { level: 'medium' },
    duration: 148,
    bpm: 120,
    key: 'C major',
    statistics: {
      playCount: 18700,
      averageScore: 8200,
      averageAccuracy: 84.6,
      completionRate: 88.9
    },
    availability: { premium: false },
    tags: ['swing', 'romantic', 'timeless'],
    description: 'Sinatra\'s classic, arranged for solo piano.'
  },

  // Movie Themes
  {
    _id: '12',
    title: 'River Flows in You',
    artist: 'Yiruma',
    genre: 'contemporary',
    difficulty: { level: 'medium' },
    duration: 207,
    bpm: 60,
    key: 'A major',
    statistics: {
      playCount: 29400,
      averageScore: 8600,
      averageAccuracy: 87.2,
      completionRate: 90.5
    },
    availability: { premium: false },
    featured: true,
    tags: ['peaceful', 'flowing', 'modern'],
    description: 'Yiruma\'s beautiful contemporary piece.'
  },
  {
    _id: '13',
    title: 'Pirates of the Caribbean Theme',
    artist: 'Hans Zimmer',
    genre: 'movie',
    difficulty: { level: 'hard' },
    duration: 198,
    bpm: 168,
    key: 'D minor',
    statistics: {
      playCount: 22100,
      averageScore: 10200,
      averageAccuracy: 78.3,
      completionRate: 74.1
    },
    availability: { premium: true },
    trending: true,
    tags: ['epic', 'adventure', 'orchestral'],
    description: 'The epic theme from Pirates of the Caribbean.'
  },

  // Classical Advanced
  {
    _id: '14',
    title: 'Chopin Nocturne Op.9 No.2',
    artist: 'Chopin',
    genre: 'classical',
    difficulty: { level: 'expert' },
    duration: 270,
    bpm: 120,
    key: 'Eb major',
    statistics: {
      playCount: 8900,
      averageScore: 13800,
      averageAccuracy: 71.6,
      completionRate: 52.3
    },
    availability: { premium: true },
    featured: true,
    tags: ['romantic', 'expressive', 'technical'],
    description: 'One of Chopin\'s most beautiful nocturnes.'
  },
  {
    _id: '15',
    title: 'Turkish March',
    artist: 'Mozart',
    genre: 'classical',
    difficulty: { level: 'hard' },
    duration: 210,
    bpm: 120,
    key: 'A major',
    statistics: {
      playCount: 16200,
      averageScore: 11400,
      averageAccuracy: 77.8,
      completionRate: 69.4
    },
    availability: { premium: true },
    tags: ['energetic', 'classical', 'technical'],
    description: 'Mozart\'s famous and energetic Turkish March.'
  },

  // Electronic/Modern
  {
    _id: '16',
    title: 'Comptine d\'un autre été',
    artist: 'Yann Tiersen',
    genre: 'contemporary',
    difficulty: { level: 'medium' },
    duration: 143,
    bpm: 120,
    key: 'G minor',
    statistics: {
      playCount: 24800,
      averageScore: 8800,
      averageAccuracy: 85.7,
      completionRate: 89.2
    },
    availability: { premium: false },
    featured: true,
    tags: ['melancholic', 'beautiful', 'french'],
    description: 'Beautiful piece from the movie Amélie.'
  },

  // Christmas/Holiday
  {
    _id: '17',
    title: 'Silent Night',
    artist: 'Traditional',
    genre: 'holiday',
    difficulty: { level: 'easy' },
    duration: 145,
    bpm: 60,
    key: 'C major',
    statistics: {
      playCount: 35600,
      averageScore: 6900,
      averageAccuracy: 94.2,
      completionRate: 98.1
    },
    availability: { premium: false },
    tags: ['christmas', 'peaceful', 'traditional'],
    description: 'The beloved Christmas carol arranged for piano.'
  },

  // Video Game Music
  {
    _id: '18',
    title: 'Sweden (Minecraft Theme)',
    artist: 'C418',
    genre: 'game',
    difficulty: { level: 'easy' },
    duration: 213,
    bpm: 120,
    key: 'F major',
    statistics: {
      playCount: 28900,
      averageScore: 7400,
      averageAccuracy: 92.3,
      completionRate: 95.7
    },
    availability: { premium: false },
    trending: true,
    tags: ['gaming', 'nostalgic', 'peaceful'],
    description: 'The iconic Minecraft theme that brings back memories.'
  },

  // Asian Pop
  {
    _id: '19',
    title: 'Spring Day',
    artist: 'BTS',
    genre: 'kpop',
    difficulty: { level: 'medium' },
    duration: 236,
    bpm: 70,
    key: 'F major',
    statistics: {
      playCount: 31200,
      averageScore: 8100,
      averageAccuracy: 86.8,
      completionRate: 88.4
    },
    availability: { premium: true },
    trending: true,
    tags: ['kpop', 'emotional', 'popular'],
    description: 'BTS\'s emotional hit arranged for piano.'
  },

  // Lo-fi/Chill
  {
    _id: '20',
    title: 'Lofi Hip Hop Study Mix',
    artist: 'Various Artists',
    genre: 'lofi',
    difficulty: { level: 'easy' },
    duration: 189,
    bpm: 85,
    key: 'Am',
    statistics: {
      playCount: 42100,
      averageScore: 6700,
      averageAccuracy: 93.8,
      completionRate: 96.9
    },
    availability: { premium: false },
    trending: true,
    tags: ['chill', 'study', 'relaxing'],
    description: 'Relaxing lo-fi beats perfect for studying or chilling.'
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
        score: { 
          ...initialState.score, 
          multiplier: getDifficultyMultiplier(state.gameSettings.difficulty)
        },
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
      const finalRewards = calculateRewards(state);

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

    default:
      return state;
  }
};

// Helper functions
const getDifficultyMultiplier = (difficulty) => {
  const multipliers = {
    easy: 1.0,
    medium: 1.2,
    hard: 1.5,
    expert: 2.0
  };
  return multipliers[difficulty] || 1.0;
};

const calculateRewards = (state) => {
  const baseCoins = Math.floor(state.score.current * 0.01);
  const accuracyBonus = state.stats.accuracy >= 90 ? Math.floor(baseCoins * 0.2) : 0;
  const comboBonus = state.score.maxCombo >= 50 ? 20 : state.score.maxCombo >= 25 ? 10 : 0;
  const difficultyBonus = getDifficultyMultiplier(state.currentMusic?.difficulty?.level || 'easy') - 1;
  
  return {
    coins: baseCoins,
    experience: Math.floor(state.score.current * 0.1),
    bonusCoins: accuracyBonus + comboBonus + Math.floor(baseCoins * difficultyBonus),
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
        payload: { achievements: [] }
      });

      toast.success(t('game.gameComplete'));
    }
  }, [state.sessionId, state.gameState, t]);

  const processKeystroke = useCallback(async (keystrokeData) => {
    if (state.gameState !== GAME_STATES.PLAYING || !state.sessionId) return;

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
          accuracy: ((user.statistics?.accuracy || 0) + state.stats.accuracy) / 2,
          perfectNotes: (user.statistics?.perfectNotes || 0) + state.stats.perfectHits
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
  }, [state.sessionId, state.gameState, state.rewards, state.score.current, state.stats, user, updateProfile]);

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

  // Music library functions
  const getMusicById = useCallback((id) => {
    return mockMusicLibrary.find(m => m._id === id) || null;
  }, []);

  const searchMusic = useCallback((params) => {
    let results = [...mockMusicLibrary];
    
    if (params.q) {
      results = results.filter(m => 
        m.title.toLowerCase().includes(params.q.toLowerCase()) ||
        m.artist.toLowerCase().includes(params.q.toLowerCase()) ||
        m.genre.toLowerCase().includes(params.q.toLowerCase()) ||
        m.tags?.some(tag => tag.toLowerCase().includes(params.q.toLowerCase()))
      );
    }
    
    if (params.genres && params.genres.length > 0) {
      results = results.filter(m => params.genres.includes(m.genre));
    }
    
    if (params.difficulties && params.difficulties.length > 0) {
      results = results.filter(m => params.difficulties.includes(m.difficulty.level));
    }

    if (params.premium !== undefined) {
      results = results.filter(m => m.availability.premium === params.premium);
    }

    if (params.trending) {
      results = results.filter(m => m.trending);
    }

    if (params.featured) {
      results = results.filter(m => m.featured);
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

  const getMusicByDifficulty = useCallback((difficulty) => {
    return mockMusicLibrary.filter(m => m.difficulty.level === difficulty);
  }, []);

  const getRecommendedMusic = useCallback((userLevel = 1) => {
    // Recommend music based on user level
    let recommendedDifficulty;
    if (userLevel < 5) recommendedDifficulty = 'easy';
    else if (userLevel < 15) recommendedDifficulty = 'medium';
    else if (userLevel < 25) recommendedDifficulty = 'hard';
    else recommendedDifficulty = 'expert';

    return mockMusicLibrary
      .filter(m => m.difficulty.level === recommendedDifficulty)
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
    getMusicByDifficulty,
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