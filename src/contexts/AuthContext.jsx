// client/src/contexts/AuthContext.jsx - Authentication context and provider
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { authService } from '@services/authService';
import { tokenManager } from '@utils/tokenManager';
import { toast } from 'react-hot-toast';

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING'
};

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  loginAttempts: 0,
  lastLoginTime: null
};

// Auth Reducer
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

    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true
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

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // Check authentication status on app load
  const { data: userData, isLoading: userLoading } = useQuery(
    'currentUser',
    authService.getCurrentUser,
    {
      enabled: !!tokenManager.getAccessToken(),
      retry: false,
      onSuccess: (user) => {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user }
        });
      },
      onError: () => {
        tokenManager.clearTokens();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    }
  );

  // Login Mutation
  const loginMutation = useMutation(authService.login, {
    onMutate: () => {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data;
      tokenManager.setTokens(accessToken, refreshToken);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user }
      });

      toast.success(`Welcome back, ${user.username}!`);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
    }
  });

  // Register Mutation
  const registerMutation = useMutation(authService.register, {
    onMutate: () => {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    },
    onSuccess: (data) => {
      const { token, user } = data;
      tokenManager.setTokens(token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user }
      });

      toast.success(`Welcome to BigCoin Piano, ${user.username}!`);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
    }
  });

  // Logout Mutation
  const logoutMutation = useMutation(authService.logout, {
    onSuccess: () => {
      tokenManager.clearTokens();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Force logout even if API call fails
      tokenManager.clearTokens();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      queryClient.clear();
    }
  });

  // Update Profile Mutation
  const updateProfileMutation = useMutation(authService.updateProfile, {
    onSuccess: (updatedUser) => {
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser
      });
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries('currentUser');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Update failed';
      toast.error(errorMessage);
    }
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation(authService.changePassword, {
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
    }
  });

  // Auto-refresh token
  useEffect(() => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return;

    const refreshInterval = setInterval(async () => {
      try {
        const response = await authService.refreshToken();
        const { accessToken, refreshToken: newRefreshToken, user } = response;
        
        tokenManager.setTokens(accessToken, newRefreshToken);
        dispatch({
          type: AUTH_ACTIONS.REFRESH_TOKEN,
          payload: { user }
        });
      } catch (error) {
        console.error('Token refresh failed:', error);
        tokenManager.clearTokens();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        queryClient.clear();
      }
    }, 25 * 60 * 1000); // Refresh every 25 minutes

    return () => clearInterval(refreshInterval);
  }, [queryClient]);

  // Update loading state
  useEffect(() => {
    dispatch({
      type: AUTH_ACTIONS.SET_LOADING,
      payload: userLoading
    });
  }, [userLoading]);

  // Auth Helper Functions
  const login = async (credentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const register = async (userData) => {
    return registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const updateProfile = async (profileData) => {
    return updateProfileMutation.mutateAsync(profileData);
  };

  const changePassword = async (passwordData) => {
    return changePasswordMutation.mutateAsync(passwordData);
  };

  const checkAuth = () => {
    return !!tokenManager.getAccessToken() && state.isAuthenticated;
  };

  const hasPermission = (permission) => {
    if (!state.user) return false;
    
    // Check user level permissions
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

  // Context Value
  const value = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    
    // Helpers
    checkAuth,
    hasPermission,
    getBalanceInfo,
    getUserStats,
    isFeatureUnlocked,
    
    // Loading states
    isLoggingIn: loginMutation.isLoading,
    isRegistering: registerMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
    isUpdatingProfile: updateProfileMutation.isLoading,
    isChangingPassword: changePasswordMutation.isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for components that require authentication
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <Component {...props} />;
  };
};

// Auth Status Hook for conditional rendering
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