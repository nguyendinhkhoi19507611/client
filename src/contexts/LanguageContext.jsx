// client/src/contexts/LanguageContext.jsx - Internationalization context
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Language Context
const LanguageContext = createContext();

// Language Actions
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_TRANSLATIONS: 'SET_TRANSLATIONS',
  SET_LOADING: 'SET_LOADING'
};

// Initial State
const initialState = {
  currentLanguage: 'en',
  supportedLanguages: ['en', 'vi'],
  translations: {},
  isLoading: false
};

// Language Reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload
      };

    case LANGUAGE_ACTIONS.SET_TRANSLATIONS:
      return {
        ...state,
        translations: {
          ...state.translations,
          [action.payload.language]: action.payload.translations
        }
      };

    case LANGUAGE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    default:
      return state;
  }
};

// Default translations
const defaultTranslations = {
  en: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      play: 'Play',
      pause: 'Pause',
      stop: 'Stop'
    },
    
    // Navigation
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      game: 'Game',
      music: 'Music Library',
      profile: 'Profile',
      settings: 'Settings',
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout'
    },
    
    // Game
    game: {
      title: 'BigCoin Piano',
      subtitle: 'Mine cryptocurrency by playing piano',
      startGame: 'Start Game',
      endGame: 'End Game',
      pauseGame: 'Pause Game',
      resumeGame: 'Resume Game',
      score: 'Score',
      combo: 'Combo',
      accuracy: 'Accuracy',
      perfect: 'Perfect',
      good: 'Good',
      miss: 'Miss',
      gameComplete: 'Game Complete!',
      playAgain: 'Play Again'
    },
    
    // Music
    music: {
      library: 'Music Library',
      trending: 'Trending',
      featured: 'Featured',
      newReleases: 'New Releases',
      difficulty: 'Difficulty',
      duration: 'Duration',
      artist: 'Artist',
      genre: 'Genre',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      expert: 'Expert'
    },
    
    // Auth
    auth: {
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginTitle: 'Welcome Back',
      registerTitle: 'Join BigCoin Piano',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      createAccount: 'Create Account'
    },
    
    // Profile
    profile: {
      myProfile: 'My Profile',
      editProfile: 'Edit Profile',
      statistics: 'Statistics',
      achievements: 'Achievements',
      gameHistory: 'Game History',
      totalGames: 'Total Games',
      bestScore: 'Best Score',
      totalPlayTime: 'Total Play Time',
      level: 'Level',
      experience: 'Experience'
    },
    
    // Wallet & Payment
    wallet: {
      balance: 'Balance',
      withdraw: 'Withdraw',
      deposit: 'Deposit',
      transaction: 'Transaction',
      history: 'History',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      bigcoins: 'BigCoins',
      usd: 'USD',
      vnd: 'VND'
    }
  },
  
  vi: {
    // Common
    common: {
      loading: 'Đang tải...',
      error: 'Lỗi',
      success: 'Thành công',
      cancel: 'Hủy',
      save: 'Lưu',
      close: 'Đóng',
      back: 'Quay lại',
      next: 'Tiếp theo',
      previous: 'Trước đó',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      sort: 'Sắp xếp',
      play: 'Chơi',
      pause: 'Tạm dừng',
      stop: 'Dừng'
    },
    
    // Navigation
    nav: {
      home: 'Trang chủ',
      dashboard: 'Bảng điều khiển',
      game: 'Trò chơi',
      music: 'Thư viện nhạc',
      profile: 'Hồ sơ',
      settings: 'Cài đặt',
      login: 'Đăng nhập',
      register: 'Đăng ký',
      logout: 'Đăng xuất'
    },
    
    // Game
    game: {
      title: 'BigCoin Piano',
      subtitle: 'Đào tiền mã hóa bằng cách chơi piano',
      startGame: 'Bắt đầu',
      endGame: 'Kết thúc',
      pauseGame: 'Tạm dừng',
      resumeGame: 'Tiếp tục',
      score: 'Điểm',
      combo: 'Combo',
      accuracy: 'Độ chính xác',
      perfect: 'Hoàn hảo',
      good: 'Tốt',
      miss: 'Trượt',
      gameComplete: 'Hoàn thành!',
      playAgain: 'Chơi lại'
    },
    
    // Music
    music: {
      library: 'Thư viện nhạc',
      trending: 'Thịnh hành',
      featured: 'Nổi bật',
      newReleases: 'Mới phát hành',
      difficulty: 'Độ khó',
      duration: 'Thời lượng',
      artist: 'Nghệ sĩ',
      genre: 'Thể loại',
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó',
      expert: 'Chuyên gia'
    },
    
    // Auth
    auth: {
      username: 'Tên người dùng',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      loginTitle: 'Chào mừng trở lại',
      registerTitle: 'Tham gia BigCoin Piano',
      forgotPassword: 'Quên mật khẩu?',
      rememberMe: 'Ghi nhớ đăng nhập',
      alreadyHaveAccount: 'Đã có tài khoản?',
      dontHaveAccount: 'Chưa có tài khoản?',
      createAccount: 'Tạo tài khoản'
    },
    
    // Profile
    profile: {
      myProfile: 'Hồ sơ của tôi',
      editProfile: 'Chỉnh sửa hồ sơ',
      statistics: 'Thống kê',
      achievements: 'Thành tích',
      gameHistory: 'Lịch sử trò chơi',
      totalGames: 'Tổng số trò chơi',
      bestScore: 'Điểm cao nhất',
      totalPlayTime: 'Tổng thời gian chơi',
      level: 'Cấp độ',
      experience: 'Kinh nghiệm'
    },
    
    // Wallet & Payment
    wallet: {
      balance: 'Số dư',
      withdraw: 'Rút tiền',
      deposit: 'Nạp tiền',
      transaction: 'Giao dịch',
      history: 'Lịch sử',
      pending: 'Đang chờ',
      completed: 'Hoàn thành',
      failed: 'Thất bại',
      bigcoins: 'BigCoins',
      usd: 'USD',
      vnd: 'VND'
    }
  }
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, {
    ...initialState,
    translations: defaultTranslations
  });

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && state.supportedLanguages.includes(savedLanguage)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: savedLanguage });
    }
  }, [state.supportedLanguages]);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', state.currentLanguage);
  }, [state.currentLanguage]);

  // Set language
  const setLanguage = (language) => {
    if (state.supportedLanguages.includes(language)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: language });
    }
  };

  // Get translation
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = state.translations[state.currentLanguage];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        translation = null;
        break;
      }
    }
    
    // Fallback to English if translation not found
    if (!translation && state.currentLanguage !== 'en') {
      let fallback = state.translations.en;
      for (const k of keys) {
        if (fallback && typeof fallback === 'object') {
          fallback = fallback[k];
        } else {
          fallback = null;
          break;
        }
      }
      translation = fallback;
    }
    
    // Final fallback to key itself
    if (!translation) {
      translation = key;
    }
    
    // Replace parameters
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), value);
      });
    }
    
    return translation;
  };

  // Get language name
  const getLanguageName = (langCode) => {
    const languageNames = {
      en: 'English',
      vi: 'Tiếng Việt'
    };
    return languageNames[langCode] || langCode;
  };

  // Check if RTL language
  const isRTL = () => {
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(state.currentLanguage);
  };

  // Format number based on locale
  const formatNumber = (number) => {
    const locales = {
      en: 'en-US',
      vi: 'vi-VN'
    };
    
    return new Intl.NumberFormat(locales[state.currentLanguage] || 'en-US').format(number);
  };

  // Format currency based on locale
  const formatCurrency = (amount, currency = 'USD') => {
    const locales = {
      en: 'en-US',
      vi: 'vi-VN'
    };
    
    const currencyMap = {
      USD: 'USD',
      VND: 'VND',
      BIGCOIN: null // Custom handling
    };
    
    if (currency === 'BIGCOIN') {
      return `${formatNumber(amount)} BC`;
    }
    
    return new Intl.NumberFormat(locales[state.currentLanguage] || 'en-US', {
      style: 'currency',
      currency: currencyMap[currency] || 'USD'
    }).format(amount);
  };

  // Format date based on locale
  const formatDate = (date, options = {}) => {
    const locales = {
      en: 'en-US',
      vi: 'vi-VN'
    };
    
    return new Intl.DateTimeFormat(locales[state.currentLanguage] || 'en-US', options).format(new Date(date));
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    setLanguage,
    t,
    
    // Utilities
    getLanguageName,
    isRTL,
    formatNumber,
    formatCurrency,
    formatDate
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation hook
export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};

export default LanguageContext;