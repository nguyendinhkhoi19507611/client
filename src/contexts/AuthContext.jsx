import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';
const AuthContext = createContext();
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING'
};
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lastLoginTime: null
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
        isLoading: false
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

    default:
      return state;
  }
};
const mockUsers = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@bigcoinpiano.com',
    password: 'password',
    coins: {
      available: 1234.56,
      pending: 45.23,
      total: 1279.79
    },
    statistics: {
      level: 12,
      experience: 2450,
      totalGames: 89,
      bestScore: 98765,
      totalPlayTime: 15420,
      accuracy: 87.5
    },
    subscriptions: {
      premium: {
        active: true,
        expiresAt: new Date('2025-12-31')
      }
    },
    kyc: {
      status: 'verified'
    },
    role: 'user'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@bigcoinpiano.com',
    password: 'admin123',
    coins: {
      available: 5000.00,
      pending: 0,
      total: 5000.00
    },
    statistics: {
      level: 25,
      experience: 10000,
      totalGames: 500,
      bestScore: 150000,
      totalPlayTime: 50000,
      accuracy: 95.0
    },
    role: 'admin'
  }
];
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const savedUser = localStorage.getItem('bigcoin_user');
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
      toast.success(`Welcome back, ${user.username}!`);
      return userToStore;
    } else {
      const errorMessage = 'Invalid email or password';
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
      const errorMessage = 'User already exists';
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
      coins: {
        available: 100,
        pending: 0,
        total: 100
      },
      statistics: {
        level: 1,
        experience: 0,
        totalGames: 0,
        bestScore: 0,
        totalPlayTime: 0,
        accuracy: 0
      },
      subscriptions: {
        premium: {
          active: false,
          expiresAt: null
        }
      },
      kyc: {
        status: 'pending'
      },
      role: 'user'
    };
    mockUsers.push({ ...newUser, password: userData.password });
    localStorage.setItem('bigcoin_user', JSON.stringify(newUser));
    
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: newUser }
    });
    
    toast.success(`Welcome to BigCoin Piano, ${newUser.username}! You received 100 bonus coins!`);
    return newUser;
  };
  const logout = async () => {
    localStorage.removeItem('bigcoin_user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };
  const updateProfile = async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...state.user, ...profileData };
    localStorage.setItem('bigcoin_user', JSON.stringify(updatedUser));
    
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: profileData
    });
    
    toast.success('Profile updated successfully');
    return updatedUser;
  };
  const changePassword = async (passwordData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Password changed successfully');
  };
  const checkAuth = () => {
    return state.isAuthenticated;
  };

  const hasPermission = (permission) => {
    if (!state.user) return false;
    
    const userLevel = state.user.statistics?.level || 1;
    const permissions = {
      'game.play': userLevel >= 1,
      'game.multiplayer': userLevel >= 5,
      'payment.withdraw': state.user.kyc?.status === 'verified',
      'premium.access': state.user.subscriptions?.premium?.active,
      'admin.access': state.user.role === 'admin'
    };

    return permissions[permission] || false;
  };

  const getBalanceInfo = () => {
    if (!state.user) return { available: 0, pending: 0, total: 0 };
    
    return {
      available: state.user.coins?.available || 0,
      pending: state.user.coins?.pending || 0,
      total: state.user.coins?.total || 0
    };
  };

  const getUserStats = () => {
    if (!state.user) return null;
    
    return {
      level: state.user.statistics?.level || 1,
      experience: state.user.statistics?.experience || 0,
      totalGames: state.user.statistics?.totalGames || 0,
      bestScore: state.user.statistics?.bestScore || 0,
      totalPlayTime: state.user.statistics?.totalPlayTime || 0
    };
  };

  const isFeatureUnlocked = (feature) => {
    if (!state.user) return false;
    
    const userLevel = state.user.statistics?.level || 1;
    const featureRequirements = {
      'leaderboard': 1,
      'multiplayer': 5,
      'advanced_analytics': 10,
      'custom_themes': 15,
      'tournament_mode': 20
    };

    return userLevel >= (featureRequirements[feature] || 1);
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    hasPermission,
    getBalanceInfo,
    getUserStats,
    isFeatureUnlocked,
    isLoggingIn: state.isLoading,
    isRegistering: state.isLoading,
    isLoggingOut: false,
    isUpdatingProfile: false,
    isChangingPassword: false
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

export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>;
    }
    
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
    
    return <Component {...props} />;
  };
};

export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    isGuest: !isAuthenticated && !isLoading,
    user
  };
};

export default AuthContext;