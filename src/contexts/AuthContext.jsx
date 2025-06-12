// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
  SET_LANGUAGE: 'SET_LANGUAGE'
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lastLoginTime: null,
  language: 'en'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginAttempts: 0,
        lastLoginTime: new Date()
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        loginAttempts: state.loginAttempts + 1
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
        language: state.language
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case AUTH_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
    default:
      return state;
  }
};

// Enhanced mock users with more detailed data
const mockUsers = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@bigcoinpiano.com',
    password: 'password',
    fullName: 'Demo User',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    country: 'Vietnam',
    joinedDate: '2024-01-15',
    coins: {
      available: 1234.56,
      pending: 45.23,
      total: 1279.79,
      earned: 2500.00,
      withdrawn: 1220.21
    },
    statistics: {
      level: 12,
      experience: 2450,
      totalGames: 89,
      bestScore: 98765,
      totalPlayTime: 15420,
      accuracy: 87.5,
      perfectNotes: 1250,
      streak: 15,
      averageAccuracy: 85.2
    },
    subscriptions: {
      premium: {
        active: true,
        type: 'monthly',
        expiresAt: new Date('2025-12-31'),
        features: ['unlimited_songs', 'advanced_analytics', 'priority_support']
      }
    },
    kyc: {
      status: 'verified',
      submittedAt: '2024-01-20',
      verifiedAt: '2024-01-22',
      documents: {
        id: 'verified',
        address: 'verified',
        photo: 'verified'
      }
    },
    preferences: {
      language: 'en',
      soundEnabled: true,
      visualEffects: true,
      notifications: {
        achievements: true,
        rewards: true,
        promotions: false
      }
    },
    achievements: [
      { id: 'first_game', name: 'First Steps', unlockedAt: '2024-01-15' },
      { id: 'level_10', name: 'Rising Star', unlockedAt: '2024-02-10' },
      { id: 'perfect_score', name: 'Perfectionist', unlockedAt: '2024-03-05' },
      { id: 'coin_master', name: 'Coin Master', unlockedAt: '2024-03-15' }
    ],
    gameHistory: [
      {
        id: 'game_1',
        musicId: '1',
        musicTitle: 'Für Elise',
        score: 9500,
        accuracy: 94.2,
        coinsEarned: 12.5,
        playedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        difficulty: 'medium',
        duration: 180
      },
      {
        id: 'game_2',
        musicId: '2',
        musicTitle: 'Canon in D',
        score: 8750,
        accuracy: 89.1,
        coinsEarned: 10.8,
        playedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        difficulty: 'hard',
        duration: 240
      }
    ],
    transactions: [
      {
        id: 'tx_1',
        type: 'earning',
        amount: 12.5,
        currency: 'BIGCOIN',
        status: 'completed',
        description: 'Game reward - Für Elise',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'tx_2',
        type: 'withdrawal',
        amount: 100,
        currency: 'USD',
        status: 'processing',
        description: 'Withdrawal to bank account',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        fee: 2.5
      }
    ],
    role: 'user'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@bigcoinpiano.com',
    password: 'admin123',
    fullName: 'Admin User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    country: 'Singapore',
    joinedDate: '2023-01-01',
    coins: {
      available: 10000.00,
      pending: 0,
      total: 10000.00,
      earned: 25000.00,
      withdrawn: 15000.00
    },
    statistics: {
      level: 25,
      experience: 10000,
      totalGames: 500,
      bestScore: 150000,
      totalPlayTime: 50000,
      accuracy: 95.0,
      perfectNotes: 5000,
      streak: 50,
      averageAccuracy: 92.8
    },
    subscriptions: {
      premium: {
        active: true,
        type: 'lifetime',
        expiresAt: null,
        features: ['all_premium_features', 'admin_tools', 'analytics_dashboard']
      }
    },
    kyc: {
      status: 'verified',
      submittedAt: '2023-01-01',
      verifiedAt: '2023-01-01'
    },
    preferences: {
      language: 'en',
      soundEnabled: true,
      visualEffects: true,
      notifications: {
        achievements: true,
        rewards: true,
        promotions: true,
        admin: true
      }
    },
    permissions: [
      'admin_dashboard',
      'user_management',
      'music_management',
      'payment_management',
      'analytics_view',
      'system_settings'
    ],
    role: 'admin'
  },
  {
    id: '3',
    username: 'user_vn',
    email: 'user@bigcoinpiano.com',
    password: 'user123',
    fullName: 'Người dùng Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    country: 'Vietnam',
    joinedDate: '2024-02-01',
    coins: {
      available: 567.89,
      pending: 12.34,
      total: 580.23,
      earned: 800.00,
      withdrawn: 219.77
    },
    statistics: {
      level: 8,
      experience: 1200,
      totalGames: 45,
      bestScore: 65000,
      totalPlayTime: 8500,
      accuracy: 82.3,
      perfectNotes: 850,
      streak: 8,
      averageAccuracy: 80.5
    },
    subscriptions: {
      premium: {
        active: false,
        type: null,
        expiresAt: null
      }
    },
    kyc: {
      status: 'pending',
      submittedAt: '2024-02-15'
    },
    preferences: {
      language: 'vi',
      soundEnabled: true,
      visualEffects: true,
      notifications: {
        achievements: true,
        rewards: true,
        promotions: true
      }
    },
    achievements: [
      { id: 'first_game', name: 'Bước đầu tiên', unlockedAt: '2024-02-01' },
      { id: 'level_5', name: 'Người chơi mới', unlockedAt: '2024-02-20' }
    ],
    role: 'user'
  }
];

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('bigcoin_user');
    const savedLanguage = localStorage.getItem('bigcoin_language') || 'en';
    
    dispatch({ type: AUTH_ACTIONS.SET_LANGUAGE, payload: savedLanguage });
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user }
        });
      } catch (error) {
        localStorage.removeItem('bigcoin_user');
      }
    }
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
  }, []);

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const userToStore = { ...user };
      delete userToStore.password; 
      localStorage.setItem('bigcoin_user', JSON.stringify(userToStore));
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: userToStore }
      });
      
      const welcomeMessage = userToStore.preferences.language === 'vi' 
        ? `Chào mừng trở lại, ${user.username}!`
        : `Welcome back, ${user.username}!`;
      toast.success(welcomeMessage);
      return userToStore;
    } else {
      const errorMessage = state.language === 'vi' 
        ? 'Email hoặc mật khẩu không đúng'
        : 'Invalid email or password';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const existingUser = mockUsers.find(u => 
      u.email === userData.email || u.username === userData.username
    );

    if (existingUser) {
      const errorMessage = state.language === 'vi' 
        ? 'Người dùng đã tồn tại'
        : 'User already exists';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName || userData.username,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&sig=${Date.now()}`,
      country: 'Vietnam',
      joinedDate: new Date().toISOString().split('T')[0],
      coins: {
        available: 100,
        pending: 0,
        total: 100,
        earned: 100,
        withdrawn: 0
      },
      statistics: {
        level: 1,
        experience: 0,
        totalGames: 0,
        bestScore: 0,
        totalPlayTime: 0,
        accuracy: 0,
        perfectNotes: 0,
        streak: 0,
        averageAccuracy: 0
      },
      subscriptions: {
        premium: {
          active: false,
          type: null,
          expiresAt: null
        }
      },
      kyc: {
        status: 'not_submitted'
      },
      preferences: {
        language: state.language,
        soundEnabled: true,
        visualEffects: true,
        notifications: {
          achievements: true,
          rewards: true,
          promotions: true
        }
      },
      achievements: [
        { id: 'welcome', name: 'Welcome!', unlockedAt: new Date().toISOString() }
      ],
      gameHistory: [],
      transactions: [
        {
          id: 'welcome_bonus',
          type: 'bonus',
          amount: 100,
          currency: 'BIGCOIN',
          status: 'completed',
          description: 'Welcome bonus',
          timestamp: new Date()
        }
      ],
      role: 'user'
    };

    mockUsers.push({ ...newUser, password: userData.password });
    localStorage.setItem('bigcoin_user', JSON.stringify(newUser));
    
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: newUser }
    });
    
    const successMessage = state.language === 'vi' 
      ? `Chào mừng đến với BigCoin Piano, ${newUser.username}! Bạn đã nhận được 100 BigCoins thưởng!`
      : `Welcome to BigCoin Piano, ${newUser.username}! You received 100 bonus BigCoins!`;
    toast.success(successMessage);
    return newUser;
  };

  const logout = async () => {
    localStorage.removeItem('bigcoin_user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    const message = state.language === 'vi' 
      ? 'Đăng xuất thành công'
      : 'Logged out successfully';
    toast.success(message);
  };

  const updateProfile = async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...state.user, ...profileData };
    localStorage.setItem('bigcoin_user', JSON.stringify(updatedUser));
    
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: profileData
    });
    
    const message = state.language === 'vi' 
      ? 'Cập nhật hồ sơ thành công'
      : 'Profile updated successfully';
    toast.success(message);
    return updatedUser;
  };

  const changeLanguage = (language) => {
    localStorage.setItem('bigcoin_language', language);
    dispatch({ type: AUTH_ACTIONS.SET_LANGUAGE, payload: language });
    
    if (state.user) {
      updateProfile({ preferences: { ...state.user.preferences, language } });
    }
  };

  const hasPermission = (permission) => {
    if (!state.user) return false;
    
    if (state.user.role === 'admin') return true;
    
    const userLevel = state.user.statistics?.level || 1;
    const permissions = {
      'game.play': userLevel >= 1,
      'game.multiplayer': userLevel >= 5,
      'payment.withdraw': state.user.kyc?.status === 'verified',
      'premium.access': state.user.subscriptions?.premium?.active,
      'admin.access': state.user.role === 'admin',
      'music.upload': userLevel >= 10,
      'leaderboard.view': userLevel >= 3
    };

    return permissions[permission] || false;
  };

  const getBalanceInfo = () => {
    if (!state.user) return { available: 0, pending: 0, total: 0 };
    
    return {
      available: state.user.coins?.available || 0,
      pending: state.user.coins?.pending || 0,
      total: state.user.coins?.total || 0,
      earned: state.user.coins?.earned || 0,
      withdrawn: state.user.coins?.withdrawn || 0
    };
  };

  const getUserStats = () => {
    if (!state.user) return null;
    
    return {
      level: state.user.statistics?.level || 1,
      experience: state.user.statistics?.experience || 0,
      totalGames: state.user.statistics?.totalGames || 0,
      bestScore: state.user.statistics?.bestScore || 0,
      totalPlayTime: state.user.statistics?.totalPlayTime || 0,
      accuracy: state.user.statistics?.accuracy || 0,
      perfectNotes: state.user.statistics?.perfectNotes || 0,
      streak: state.user.statistics?.streak || 0
    };
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changeLanguage,
    hasPermission,
    getBalanceInfo,
    getUserStats,
    mockUsers: mockUsers.map(u => ({ ...u, password: undefined })) // For admin panel
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;