import React, { createContext, useContext, useReducer, useEffect } from 'react';

const LanguageContext = createContext();

const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_TRANSLATIONS: 'SET_TRANSLATIONS',
  SET_LOADING: 'SET_LOADING'
};

const initialState = {
  currentLanguage: 'en',
  supportedLanguages: ['en', 'vi'],
  translations: {},
  isLoading: false
};

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

// Comprehensive translations
const defaultTranslations = {
  en: {
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
      stop: 'Stop',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      submit: 'Submit',
      retry: 'Retry',
      refresh: 'Refresh',
      view: 'View',
      download: 'Download',
      upload: 'Upload'
    },
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      game: 'Game',
      music: 'Music Library',
      profile: 'Profile',
      settings: 'Settings',
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout',
      admin: 'Admin Panel',
      leaderboard: 'Leaderboard',
      payments: 'Payments',
      achievements: 'Achievements',
      help: 'Help'
    },
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
      playAgain: 'Play Again',
      claimRewards: 'Claim Rewards',
      rewardsClaimed: 'Rewards Claimed!',
      level: 'Level',
      experience: 'Experience',
      nextLevel: 'Next Level',
      settings: 'Game Settings',
      difficulty: 'Difficulty',
      speed: 'Speed',
      volume: 'Volume',
      effects: 'Visual Effects',
      soundEffects: 'Sound Effects',
      autoPlay: 'Auto Play'
    },
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
      expert: 'Expert',
      searchPlaceholder: 'Search songs, artists...',
      noResults: 'No music found',
      tryAdjustFilters: 'Try adjusting your search or filters',
      playCount: 'Plays',
      averageScore: 'Avg Score',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      premiumOnly: 'Premium Only',
      free: 'Free',
      genres: {
        pop: 'Pop',
        rock: 'Rock',
        classical: 'Classical',
        jazz: 'Jazz',
        electronic: 'Electronic',
        hiphop: 'Hip-Hop',
        country: 'Country',
        folk: 'Folk',
        blues: 'Blues',
        reggae: 'Reggae',
        metal: 'Metal',
        punk: 'Punk'
      }
    },
    auth: {
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      loginTitle: 'Welcome Back',
      registerTitle: 'Join BigCoin Piano',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      createAccount: 'Create Account',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signInWith: 'Sign in with',
      signUpWith: 'Sign up with',
      agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
      referralCode: 'Referral Code (Optional)',
      referralCodeDesc: 'Get 50 bonus BigCoins with a valid referral code!'
    },
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
      experience: 'Experience',
      accuracy: 'Accuracy',
      perfectNotes: 'Perfect Notes',
      currentStreak: 'Current Streak',
      personalInfo: 'Personal Information',
      accountSettings: 'Account Settings',
      preferences: 'Preferences',
      notifications: 'Notifications',
      privacy: 'Privacy',
      security: 'Security',
      changePassword: 'Change Password',
      kycStatus: 'KYC Status',
      verified: 'Verified',
      pending: 'Pending',
      notSubmitted: 'Not Submitted',
      submitKyc: 'Submit KYC'
    },
    wallet: {
      balance: 'Balance',
      withdraw: 'Withdraw',
      deposit: 'Deposit',
      transaction: 'Transaction',
      history: 'History',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      processing: 'Processing',
      bigcoins: 'BigCoins',
      usd: 'USD',
      vnd: 'VND',
      sgd: 'SGD',
      availableBalance: 'Available Balance',
      pendingBalance: 'Pending Balance',
      totalEarned: 'Total Earned',
      totalWithdrawn: 'Total Withdrawn',
      withdrawalRequest: 'Withdrawal Request',
      minimumWithdrawal: 'Minimum Withdrawal',
      withdrawalFee: 'Withdrawal Fee',
      processingTime: 'Processing Time',
      bankAccount: 'Bank Account',
      paymentMethod: 'Payment Method'
    },
    dashboard: {
      welcomeBack: 'Welcome back',
      readyToEarn: 'Ready to earn some BigCoins?',
      quickActions: 'Quick Actions',
      playNow: 'Play Now',
      withdrawCoins: 'Withdraw Coins',
      viewLeaderboard: 'Leaderboard',
      recentGames: 'Recent Games',
      achievements: 'Achievements',
      featuredCollections: 'Featured Collections',
      viewAll: 'View All',
      todayEarnings: 'Today\'s Earnings',
      weeklyEarnings: 'Weekly Earnings',
      gamesPlayed: 'Games Played',
      nextLevelProgress: 'Progress to Next Level'
    },
    admin: {
      adminPanel: 'Admin Panel',
      userManagement: 'User Management',
      musicManagement: 'Music Management',
      paymentManagement: 'Payment Management',
      analytics: 'Analytics',
      systemSettings: 'System Settings',
      users: 'Users',
      songs: 'Songs',
      transactions: 'Transactions',
      reports: 'Reports',
      overview: 'Overview',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      totalRevenue: 'Total Revenue',
      pendingWithdrawals: 'Pending Withdrawals',
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      banUser: 'Ban User',
      unbanUser: 'Unban User',
      viewDetails: 'View Details'
    },
    payments: {
      paymentHistory: 'Payment History',
      withdrawalHistory: 'Withdrawal History',
      depositHistory: 'Deposit History',
      earnedFromGames: 'Earned from Games',
      bonusRewards: 'Bonus Rewards',
      referralBonus: 'Referral Bonus',
      withdrawalMethods: 'Withdrawal Methods',
      bankTransfer: 'Bank Transfer',
      digitalWallet: 'Digital Wallet',
      cryptocurrency: 'Cryptocurrency',
      feeInformation: 'Fee Information',
      withdrawalLimits: 'Withdrawal Limits',
      dailyLimit: 'Daily Limit',
      monthlyLimit: 'Monthly Limit'
    },
    notifications: {
      achievementUnlocked: 'Achievement Unlocked!',
      levelUp: 'Level Up!',
      rewardReceived: 'Reward Received!',
      withdrawalCompleted: 'Withdrawal Completed',
      withdrawalPending: 'Withdrawal is being processed',
      gameCompleted: 'Game Completed',
      newHighScore: 'New High Score!',
      comboAchieved: 'Amazing Combo!',
      perfectScore: 'Perfect Score!'
    },
    errors: {
      networkError: 'Network error occurred',
      serverError: 'Server error occurred',
      invalidCredentials: 'Invalid email or password',
      userExists: 'User already exists',
      insufficientBalance: 'Insufficient balance',
      withdrawalFailed: 'Withdrawal failed',
      gameError: 'Game error occurred',
      musicLoadError: 'Failed to load music',
      permissionDenied: 'Permission denied'
    }
  },
  
  vi: {
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
      stop: 'Dừng',
      edit: 'Chỉnh sửa',
      delete: 'Xóa',
      confirm: 'Xác nhận',
      submit: 'Gửi',
      retry: 'Thử lại',
      refresh: 'Làm mới',
      view: 'Xem',
      download: 'Tải về',
      upload: 'Tải lên'
    },
    nav: {
      home: 'Trang chủ',
      dashboard: 'Bảng điều khiển',
      game: 'Trò chơi',
      music: 'Thư viện nhạc',
      profile: 'Hồ sơ',
      settings: 'Cài đặt',
      login: 'Đăng nhập',
      register: 'Đăng ký',
      logout: 'Đăng xuất',
      admin: 'Bảng quản trị',
      leaderboard: 'Bảng xếp hạng',
      payments: 'Thanh toán',
      achievements: 'Thành tích',
      help: 'Trợ giúp'
    },
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
      playAgain: 'Chơi lại',
      claimRewards: 'Nhận thưởng',
      rewardsClaimed: 'Đã nhận thưởng!',
      level: 'Cấp độ',
      experience: 'Kinh nghiệm',
      nextLevel: 'Cấp độ tiếp theo',
      settings: 'Cài đặt trò chơi',
      difficulty: 'Độ khó',
      speed: 'Tốc độ',
      volume: 'Âm lượng',
      effects: 'Hiệu ứng hình ảnh',
      soundEffects: 'Hiệu ứng âm thanh',
      autoPlay: 'Tự động chơi'
    },
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
      expert: 'Chuyên gia',
      searchPlaceholder: 'Tìm bài hát, nghệ sĩ...',
      noResults: 'Không tìm thấy nhạc',
      tryAdjustFilters: 'Thử điều chỉnh tìm kiếm hoặc bộ lọc',
      playCount: 'Lượt chơi',
      averageScore: 'Điểm TB',
      addToFavorites: 'Thêm yêu thích',
      removeFromFavorites: 'Bỏ yêu thích',
      premiumOnly: 'Chỉ Premium',
      free: 'Miễn phí',
      genres: {
        pop: 'Pop',
        rock: 'Rock',
        classical: 'Cổ điển',
        jazz: 'Jazz',
        electronic: 'Điện tử',
        hiphop: 'Hip-Hop',
        country: 'Country',
        folk: 'Dân gian',
        blues: 'Blues',
        reggae: 'Reggae',
        metal: 'Metal',
        punk: 'Punk'
      }
    },
    auth: {
      username: 'Tên người dùng',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      fullName: 'Họ và tên',
      loginTitle: 'Chào mừng trở lại',
      registerTitle: 'Tham gia BigCoin Piano',
      forgotPassword: 'Quên mật khẩu?',
      rememberMe: 'Ghi nhớ đăng nhập',
      alreadyHaveAccount: 'Đã có tài khoản?',
      dontHaveAccount: 'Chưa có tài khoản?',
      createAccount: 'Tạo tài khoản',
      signIn: 'Đăng nhập',
      signUp: 'Đăng ký',
      signInWith: 'Đăng nhập với',
      signUpWith: 'Đăng ký với',
      agreeToTerms: 'Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật',
      referralCode: 'Mã giới thiệu (Tùy chọn)',
      referralCodeDesc: 'Nhận 50 BigCoins thưởng với mã giới thiệu hợp lệ!'
    },
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
      experience: 'Kinh nghiệm',
      accuracy: 'Độ chính xác',
      perfectNotes: 'Nốt hoàn hảo',
      currentStreak: 'Chuỗi hiện tại',
      personalInfo: 'Thông tin cá nhân',
      accountSettings: 'Cài đặt tài khoản',
      preferences: 'Tùy chọn',
      notifications: 'Thông báo',
      privacy: 'Riêng tư',
      security: 'Bảo mật',
      changePassword: 'Đổi mật khẩu',
      kycStatus: 'Trạng thái KYC',
      verified: 'Đã xác minh',
      pending: 'Đang chờ',
      notSubmitted: 'Chưa gửi',
      submitKyc: 'Gửi KYC'
    },
    wallet: {
      balance: 'Số dư',
      withdraw: 'Rút tiền',
      deposit: 'Nạp tiền',
      transaction: 'Giao dịch',
      history: 'Lịch sử',
      pending: 'Đang chờ',
      completed: 'Hoàn thành',
      failed: 'Thất bại',
      processing: 'Đang xử lý',
      bigcoins: 'BigCoins',
      usd: 'USD',
      vnd: 'VND',
      sgd: 'SGD',
      availableBalance: 'Số dư khả dụng',
      pendingBalance: 'Số dư chờ xử lý',
      totalEarned: 'Tổng thu nhập',
      totalWithdrawn: 'Tổng đã rút',
      withdrawalRequest: 'Yêu cầu rút tiền',
      minimumWithdrawal: 'Rút tối thiểu',
      withdrawalFee: 'Phí rút tiền',
      processingTime: 'Thời gian xử lý',
      bankAccount: 'Tài khoản ngân hàng',
      paymentMethod: 'Phương thức thanh toán'
    },
    dashboard: {
      welcomeBack: 'Chào mừng trở lại',
      readyToEarn: 'Sẵn sàng kiếm BigCoins?',
      quickActions: 'Thao tác nhanh',
      playNow: 'Chơi ngay',
      withdrawCoins: 'Rút tiền',
      viewLeaderboard: 'Bảng xếp hạng',
      recentGames: 'Trò chơi gần đây',
      achievements: 'Thành tích',
      featuredCollections: 'Bộ sưu tập nổi bật',
      viewAll: 'Xem tất cả',
      todayEarnings: 'Thu nhập hôm nay',
      weeklyEarnings: 'Thu nhập tuần',
      gamesPlayed: 'Trò chơi đã chơi',
      nextLevelProgress: 'Tiến độ cấp độ tiếp theo'
    },
    admin: {
      adminPanel: 'Bảng quản trị',
      userManagement: 'Quản lý người dùng',
      musicManagement: 'Quản lý nhạc',
      paymentManagement: 'Quản lý thanh toán',
      analytics: 'Phân tích',
      systemSettings: 'Cài đặt hệ thống',
      users: 'Người dùng',
      songs: 'Bài hát',
      transactions: 'Giao dịch',
      reports: 'Báo cáo',
      overview: 'Tổng quan',
      totalUsers: 'Tổng người dùng',
      activeUsers: 'Người dùng hoạt động',
      totalRevenue: 'Tổng doanh thu',
      pendingWithdrawals: 'Yêu cầu rút tiền chờ',
      addUser: 'Thêm người dùng',
      editUser: 'Sửa người dùng',
      deleteUser: 'Xóa người dùng',
      banUser: 'Cấm người dùng',
      unbanUser: 'Bỏ cấm người dùng',
      viewDetails: 'Xem chi tiết'
    },
    payments: {
      paymentHistory: 'Lịch sử thanh toán',
      withdrawalHistory: 'Lịch sử rút tiền',
      depositHistory: 'Lịch sử nạp tiền',
      earnedFromGames: 'Thu nhập từ trò chơi',
      bonusRewards: 'Thưởng bonus',
      referralBonus: 'Thưởng giới thiệu',
      withdrawalMethods: 'Phương thức rút tiền',
      bankTransfer: 'Chuyển khoản ngân hàng',
      digitalWallet: 'Ví điện tử',
      cryptocurrency: 'Tiền mã hóa',
      feeInformation: 'Thông tin phí',
      withdrawalLimits: 'Giới hạn rút tiền',
      dailyLimit: 'Giới hạn hàng ngày',
      monthlyLimit: 'Giới hạn hàng tháng'
    },
    notifications: {
      achievementUnlocked: 'Mở khóa thành tích!',
      levelUp: 'Thăng cấp!',
      rewardReceived: 'Nhận thưởng!',
      withdrawalCompleted: 'Rút tiền hoàn tất',
      withdrawalPending: 'Đang xử lý yêu cầu rút tiền',
      gameCompleted: 'Hoàn thành trò chơi',
      newHighScore: 'Điểm cao mới!',
      comboAchieved: 'Combo tuyệt vời!',
      perfectScore: 'Điểm hoàn hảo!'
    },
    errors: {
      networkError: 'Lỗi kết nối mạng',
      serverError: 'Lỗi máy chủ',
      invalidCredentials: 'Email hoặc mật khẩu không đúng',
      userExists: 'Người dùng đã tồn tại',
      insufficientBalance: 'Số dư không đủ',
      withdrawalFailed: 'Rút tiền thất bại',
      gameError: 'Lỗi trò chơi',
      musicLoadError: 'Không thể tải nhạc',
      permissionDenied: 'Không có quyền truy cập'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, {
    ...initialState,
    translations: defaultTranslations
  });

  const setLanguage = (language) => {
    if (state.supportedLanguages.includes(language)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: language });
      localStorage.setItem('language', language);
    }
  };

  const getLanguageName = (langCode) => {
    const names = {
      en: 'English',
      vi: 'Tiếng Việt'
    };
    return names[langCode] || langCode;
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = state.translations[state.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }
    
    if (typeof value !== 'string') {
      // Fallback to English if translation not found
      value = state.translations.en;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          break;
        }
      }
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if no translation found
    }
    
    // Replace parameters
    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(`{{${param}}}`, params[param]);
    });
    
    return result;
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (state.currentLanguage === 'vi') {
      if (diffInSeconds < 60) return 'Vừa xong';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
      return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
    } else {
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    }
  };

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && state.supportedLanguages.includes(savedLanguage)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: savedLanguage });
    }
  }, [state.supportedLanguages]);

  const value = {
    ...state,
    setLanguage,
    getLanguageName,
    t,
    formatRelativeTime
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Alias for useLanguage
export const useTranslation = () => {
  const { t, ...rest } = useLanguage();
  return { t, ...rest };
};

export default LanguageContext;