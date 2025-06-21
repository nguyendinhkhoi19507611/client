// src/contexts/LanguageContext.jsx - Complete translation system
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

// Complete translations for all website content
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
      upload: 'Upload',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      continue: 'Continue',
      skip: 'Skip',
      finish: 'Finish',
      start: 'Start',
      end: 'End',
      reset: 'Reset',
      clear: 'Clear',
      copy: 'Copy',
      paste: 'Paste',
      cut: 'Cut',
      select: 'Select',
      all: 'All',
      none: 'None',
      more: 'More',
      less: 'Less',
      show: 'Show',
      hide: 'Hide',
      open: 'Open',
      expand: 'Expand',
      collapse: 'Collapse',
      fullscreen: 'Fullscreen',
      minimize: 'Minimize',
      maximize: 'Maximize'
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
      help: 'Help',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms'
    },
    hero: {
      title: 'BigCoin Piano',
      subtitle: 'Mine cryptocurrency by playing piano',
      slide1: {
        title: 'Play Piano, Earn Crypto',
        subtitle: 'Mine BigCoins while mastering your musical skills'
      },
      slide2: {
        title: 'Global Leaderboards',
        subtitle: 'Compete with players worldwide and showcase your talent'
      },
      slide3: {
        title: 'Real Rewards',
        subtitle: 'Convert your BigCoins to real money through secure withdrawal'
      },
      getStarted: 'Get Started Free',
      browseMusic: 'Browse Music',
      startPlaying: 'Start Playing'
    },
    features: {
      title: 'Why Choose BigCoin Piano?',
      subtitle: 'The world\'s first blockchain-powered piano game that rewards your musical talent',
      realTimeMining: {
        title: 'Real-Time Mining',
        description: 'Earn BigCoins instantly as you play. Every perfect note adds to your wallet.'
      },
      secureBlockchain: {
        title: 'Secure Blockchain',
        description: 'Built on secure blockchain technology with verified smart contracts.'
      },
      globalCommunity: {
        title: 'Global Community',
        description: 'Join players worldwide in the largest music-earning ecosystem.'
      },
      multiplayerModes: {
        title: 'Multiplayer Modes',
        description: 'Challenge friends or compete in real-time multiplayer battles.'
      },
      earnRealMoney: {
        title: 'Earn Real Money',
        description: 'Convert BigCoins to USD, VND, or crypto'
      },
      globalCompetition: {
        title: 'Global Competition',
        description: 'Compete in leaderboards and tournaments'
      },
      vastMusicLibrary: {
        title: 'Vast Music Library',
        description: 'Thousands of songs across all genres'
      }
    },
    stats: {
      songsAvailable: 'Songs Available',
      activePlayers: 'Active Players',
      rewardsPaid: 'Rewards Paid',
      miningActive: 'Mining Active'
    },
    testimonials: {
      title: 'What Players Say',
      subtitle: 'Join thousands of satisfied musicians earning with BigCoin Piano',
      testimonial1: {
        content: 'I\'ve earned over $500 this month just by playing songs I love. It\'s amazing!',
        name: 'Sarah Chen',
        role: 'Piano Teacher'
      },
      testimonial2: {
        content: 'The leaderboards keep me motivated to practice every day. Plus, I earn money!',
        name: 'Mike Rodriguez',
        role: 'Music Student'
      },
      testimonial3: {
        content: 'Perfect way to monetize my skills. The community is incredibly supportive.',
        name: 'Emma Johnson',
        role: 'Professional Pianist'
      }
    },
    cta: {
      title: 'Ready to Start Earning?',
      subtitle: 'Join thousands of musicians already earning BigCoins. Sign up today and get 100 free BigCoins to start!',
      startPlayingNow: 'Start Playing Now',
      signIn: 'Sign In',
      goToDashboard: 'Go to Dashboard',
      noCreditCard: 'No Credit Card Required',
      instantRewards: 'Instant Rewards',
      secureVerified: 'Secure & Verified'
    },
    game: {
      title: 'BigCoin Piano',
      subtitle: 'Mine cryptocurrency by playing piano',
      startGame: 'Start Game',
      endGame: 'End Game',
      pauseGame: 'Game Paused',
      resumeGame: 'Resume Game',
      gameComplete: 'Game Complete!',
      playAgain: 'Play Again',
      claimRewards: 'Claim Rewards',
      rewardsClaimed: 'Rewards Claimed!',
      score: 'Score',
      combo: 'Combo',
      accuracy: 'Accuracy',
      perfect: 'Perfect',
      good: 'Good',
      miss: 'Miss',
      level: 'Level',
      experience: 'Experience',
      nextLevel: 'Next Level',
      settings: 'Game Settings',
      difficulty: 'Difficulty',
      speed: 'Speed',
      volume: 'Volume',
      effects: 'Visual Effects',
      soundEffects: 'Sound Effects',
      autoPlay: 'Auto Play',
      totalScore: 'Total Score',
      keysPressed: 'Keys Pressed',
      keysPerMinute: 'Keys/Min',
      time: 'Time',
      progress: 'Progress',
      startEnhancedGame: 'Start Enhanced Game',
      quickPlay: 'Quick Play',
      backToMusic: 'Back to Music',
      enhancedPracticeTrack: '🎵 Enhanced Practice Track',
      gameSettings: {
        title: 'Game Settings',
        audioSettings: 'Audio Settings',
        displaySettings: 'Display Settings',
        showMusicNotation: 'Show Music Notation',
        showKeyGuide: 'Show Key Guide',
        pianoSize: 'Piano Size',
        small: 'Small',
        normal: 'Normal',
        large: 'Large'
      },
      results: {
        title: 'Game Complete!',
        legendary: 'Legendary!',
        perfect: 'Perfect!',
        excellent: 'Excellent!',
        great: 'Great!',
        good: 'Good!',
        keepPracticing: 'Keep practicing!',
        rewardsEarned: 'Rewards Earned',
        readyToClaim: 'Ready to claim!'
      },
      piano: {
        brand: 'BIGCOIN PIANO',
        ready: 'READY',
        disabled: 'DISABLED',
        octave3: 'Octave 3',
        octave4: 'Octave 4',
        octave5: 'Octave 5',
        toggleNotation: 'Toggle Music Notation',
        currentRate: 'Current Rate:',
        perKeyPress: 'per key press'
      },
      proTip: {
        title: 'Pro Tip',
        description: 'Each key press earns you 10 BigCoins! Focus on accuracy and speed to maximize your earnings.'
      }
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
      searchPlaceholder: 'Search by song title or artist...',
      noResults: 'No music found',
      tryAdjustFilters: 'Try a different search term',
      noMusicAvailable: 'No music available',
      playCount: 'Plays',
      averageScore: 'Avg Score',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      premiumOnly: 'Premium Only',
      free: 'Free',
      mostPopular: 'Most Popular',
      newest: 'Newest',
      alphabetical: 'A-Z',
      allMusic: 'All Music',
      searchResults: 'Search Results for',
      showingResults: 'Showing',
      ofSongs: 'of',
      songs: 'songs',
      page: 'Page',
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
        punk: 'Punk',
        practice: 'Practice',
        wedding: 'Wedding'
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
      dontHaveAccount: 'Don\'t have an account?',
      createAccount: 'Create Account',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signInWith: 'Sign in with',
      signUpWith: 'Sign up with',
      agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
      referralCode: 'Referral Code (Optional)',
      referralCodeDesc: 'Get 50 bonus BigCoins with a valid referral code!',
      signInToAccount: 'Sign in to your BigCoin Piano account',
      startEarning: 'Start earning cryptocurrency by playing piano',
      chooseUsername: 'Choose a username',
      enterEmail: 'Enter your email',
      createPassword: 'Create a password',
      confirmYourPassword: 'Confirm your password',
      enterReferralCode: 'Enter referral code for bonus',
      signUpForFree: 'Sign up for free',
      signInHere: 'Sign in here',
      demo: 'Demo: demo@bigcoinpiano.com / password',
      benefits: {
        title: '🎹 Start Earning Today!',
        welcomeBonus: '• 100 free BigCoins welcome bonus',
        earnCoins: '• Earn coins for every perfect note',
        withdraw: '• Withdraw to real money or crypto',
        accessSongs: '• Access to thousands of songs'
      },
      validation: {
        usernameRequired: 'Username is required',
        usernameLength: 'Username must be at least 3 characters',
        usernameFormat: 'Username can only contain letters, numbers, and underscores',
        emailRequired: 'Email is required',
        emailInvalid: 'Email is invalid',
        passwordRequired: 'Password is required',
        passwordLength: 'Password must be at least 6 characters',
        confirmPasswordRequired: 'Please confirm your password',
        passwordMismatch: 'Passwords do not match',
        agreeTermsRequired: 'You must agree to the terms and conditions'
      }
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
      nextLevelProgress: 'Progress to Next Level',
      totalBigcoins: 'Total BigCoins',
      quickPlayDefault: 'Quick Play (Default Music)',
      browseMusicLibrary: 'Browse Music Library',
      quickStart: 'Quick Start',
      quickStartDesc: 'Don\'t want to choose? Click "Quick Play" to start earning with our default practice track immediately!',
      startEarningNow: 'Start Earning Now'
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
      viewDetails: 'View Details',
      manageYourPlatform: 'Manage your BigCoin Piano platform',
      administrator: 'Administrator',
      userGrowth: 'User Growth',
      revenueAnalytics: 'Revenue Analytics',
      systemStatus: 'System Status',
      serverUptime: 'Server Uptime',
      apiResponse: 'API Response',
      activeConnections: 'Active Connections',
      errorRate: 'Error Rate',
      recentTransactions: 'Recent Transactions',
      genreDistribution: 'Genre Distribution',
      totalPlays: 'Total Plays',
      popularGenres: 'Popular Genres',
      topSongs: 'Top Songs',
      accessDenied: 'Access Denied',
      noPermission: 'You don\'t have permission to access this page.',
      userDetails: 'User Details',
      accountInfo: 'Account Info',
      balanceInfo: 'Balance Info',
      approve: 'Approve',
      reject: 'Reject'
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
      monthlyLimit: 'Monthly Limit',
      manageWallet: 'Manage your BigCoin wallet and transactions',
      kycRequired: 'KYC verification required for withdrawals. Current status:',
      withdrawalSummary: 'Withdrawal Summary',
      amount: 'Amount',
      fee: 'Fee',
      youllReceive: 'You\'ll receive:',
      searchTransactions: 'Search transactions...',
      allStatus: 'All Status',
      export: 'Export',
      id: 'ID',
      type: 'Type',
      status: 'Status',
      description: 'Description',
      actions: 'Actions',
      viewDetails: 'View Details',
      earning: 'earning',
      withdrawal: 'withdrawal',
      bonus: 'bonus',
      directTransfer: 'Direct transfer to your bank account',
      digitalWalletDesc: 'PayPal, Skrill, or other digital wallets',
      cryptoDesc: 'Bitcoin, Ethereum, or other cryptocurrencies',
      earningSummary: 'Earning Summary',
      thisWeek: 'This Week:',
      thisMonth: 'This Month:',
      allTime: 'All Time:',
      minimumRequired: 'Minimum 50 BC required'
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
      perfectScore: 'Perfect Score!',
      welcomeBack: 'Welcome back, {username}!',
      registrationSuccess: 'Welcome to BigCoin Piano, {username}! You received 100 bonus BigCoins!',
      profileUpdated: 'Profile updated successfully',
      withdrawalSubmitted: 'Withdrawal request submitted successfully!',
      rewardsClaimed: 'Rewards claimed successfully!'
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
      permissionDenied: 'Permission denied',
      audioPlaybackFailed: 'Failed to play audio',
      musicNotFound: 'Music not found, using default music',
      errorFetchingMusic: 'Error fetching music, using default music'
    },
    notFound: {
      title: 'Oops! Page Not Found',
      description: 'The page you\'re looking for seems to have vanished into thin air.',
      subDescription: 'Maybe it\'s taking a piano lesson? 🎹',
      goHome: 'Go Home',
      goBack: 'Go Back',
      browseMusicLibrary: 'Browse Music Library'
    },
    footer: {
      company: 'Company',
      product: 'Product',
      resources: 'Resources',
      legal: 'Legal',
      aboutUs: 'About Us',
      careers: 'Careers',
      press: 'Press',
      blog: 'Blog',
      features: 'Features',
      pricing: 'Pricing',
      security: 'Security',
      support: 'Support',
      documentation: 'Documentation',
      apiReference: 'API Reference',
      community: 'Community',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      cookiePolicy: 'Cookie Policy',
      contact: 'Contact',
      followUs: 'Follow us',
      allRightsReserved: 'All rights reserved.',
      bigcoinPiano: 'BigCoin Piano'
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
      upload: 'Tải lên',
      yes: 'Có',
      no: 'Không',
      ok: 'OK',
      continue: 'Tiếp tục',
      skip: 'Bỏ qua',
      finish: 'Hoàn thành',
      start: 'Bắt đầu',
      end: 'Kết thúc',
      reset: 'Đặt lại',
      clear: 'Xóa',
      copy: 'Sao chép',
      paste: 'Dán',
      cut: 'Cắt',
      select: 'Chọn',
      all: 'Tất cả',
      none: 'Không có',
      more: 'Thêm',
      less: 'Ít hơn',
      show: 'Hiển thị',
      hide: 'Ẩn',
      open: 'Mở',
      expand: 'Mở rộng',
      collapse: 'Thu gọn',
      fullscreen: 'Toàn màn hình',
      minimize: 'Thu nhỏ',
      maximize: 'Phóng to'
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
      help: 'Trợ giúp',
      about: 'Giới thiệu',
      contact: 'Liên hệ',
      privacy: 'Riêng tư',
      terms: 'Điều khoản'
    },
    hero: {
      title: 'BigCoin Piano',
      subtitle: 'Đào tiền mã hóa bằng cách chơi piano',
      slide1: {
        title: 'Chơi Piano, Kiếm Crypto',
        subtitle: 'Đào BigCoins trong khi nâng cao kỹ năng âm nhạc của bạn'
      },
      slide2: {
        title: 'Bảng Xếp Hạng Toàn Cầu',
        subtitle: 'Cạnh tranh với người chơi trên toàn thế giới và thể hiện tài năng'
      },
      slide3: {
        title: 'Phần Thưởng Thật',
        subtitle: 'Chuyển đổi BigCoins thành tiền thật thông qua rút tiền an toàn'
      },
      getStarted: 'Bắt Đầu Miễn Phí',
      browseMusic: 'Duyệt Nhạc',
      startPlaying: 'Bắt Đầu Chơi'
    },
    features: {
      title: 'Tại Sao Chọn BigCoin Piano?',
      subtitle: 'Trò chơi piano blockchain đầu tiên trên thế giới thưởng cho tài năng âm nhạc của bạn',
      realTimeMining: {
        title: 'Đào Thời Gian Thực',
        description: 'Kiếm BigCoins ngay lập tức khi bạn chơi. Mỗi nốt hoàn hảo đều thêm vào ví của bạn.'
      },
      secureBlockchain: {
        title: 'Blockchain An Toàn',
        description: 'Được xây dựng trên công nghệ blockchain an toàn với hợp đồng thông minh đã xác minh.'
      },
      globalCommunity: {
        title: 'Cộng Đồng Toàn Cầu',
        description: 'Tham gia cùng người chơi trên toàn thế giới trong hệ sinh thái kiếm tiền từ âm nhạc lớn nhất.'
      },
      multiplayerModes: {
        title: 'Chế Độ Nhiều Người',
        description: 'Thách thức bạn bè hoặc thi đấu trong các trận chiến thời gian thực.'
      },
      earnRealMoney: {
        title: 'Kiếm Tiền Thật',
        description: 'Chuyển đổi BigCoins thành USD, VND, hoặc crypto'
      },
      globalCompetition: {
        title: 'Thi Đấu Toàn Cầu',
        description: 'Cạnh tranh trong bảng xếp hạng và giải đấu'
      },
      vastMusicLibrary: {
        title: 'Thư Viện Nhạc Phong Phú',
        description: 'Hàng nghìn bài hát thuộc mọi thể loại'
      }
    },
    stats: {
      songsAvailable: 'Bài Hát Có Sẵn',
      activePlayers: 'Người Chơi Hoạt Động',
      rewardsPaid: 'Phần Thưởng Đã Trả',
      miningActive: 'Đào Hoạt Động'
    },
    testimonials: {
      title: 'Người Chơi Nói Gì',
      subtitle: 'Tham gia cùng hàng nghìn nhạc sĩ hài lòng đang kiếm tiền với BigCoin Piano',
      testimonial1: {
        content: 'Tôi đã kiếm được hơn 500 đô la trong tháng này chỉ bằng cách chơi những bài hát tôi yêu thích. Thật tuyệt vời!',
        name: 'Sarah Chen',
        role: 'Giáo viên Piano'
      },
      testimonial2: {
        content: 'Bảng xếp hạng khiến tôi có động lực luyện tập mỗi ngày. Thêm vào đó, tôi còn kiếm được tiền!',
        name: 'Mike Rodriguez',
        role: 'Sinh viên Âm nhạc'
      },
      testimonial3: {
        content: 'Cách hoàn hảo để kiếm tiền từ kỹ năng của tôi. Cộng đồng cực kỳ hỗ trợ.',
        name: 'Emma Johnson',
        role: 'Nghệ sĩ Piano Chuyên nghiệp'
      }
    },
    cta: {
      title: 'Sẵn Sàng Bắt Đầu Kiếm Tiền?',
      subtitle: 'Tham gia cùng hàng nghìn nhạc sĩ đang kiếm BigCoins. Đăng ký hôm nay và nhận 100 BigCoins miễn phí để bắt đầu!',
      startPlayingNow: 'Bắt Đầu Chơi Ngay',
      signIn: 'Đăng Nhập',
      goToDashboard: 'Đến Bảng Điều Khiển',
      noCreditCard: 'Không Cần Thẻ Tín Dụng',
      instantRewards: 'Phần Thưởng Tức Thì',
      secureVerified: 'An Toàn & Xác Minh'
    },
    game: {
      title: 'BigCoin Piano',
      subtitle: 'Đào tiền mã hóa bằng cách chơi piano',
      startGame: 'Bắt Đầu',
      endGame: 'Kết Thúc',
      pauseGame: 'Trò chơi đã tạm dừng',
      resumeGame: 'Tiếp Tục',
      gameComplete: 'Hoàn Thành!',
      playAgain: 'Chơi Lại',
      claimRewards: 'Nhận Thưởng',
      rewardsClaimed: 'Đã Nhận Thưởng!',
      score: 'Điểm',
      combo: 'Combo',
      accuracy: 'Độ chính xác',
      perfect: 'Hoàn hảo',
      good: 'Tốt',
      miss: 'Trượt',
      level: 'Cấp độ',
      experience: 'Kinh nghiệm',
      nextLevel: 'Cấp độ tiếp theo',
      settings: 'Cài đặt trò chơi',
      difficulty: 'Độ khó',
      speed: 'Tốc độ',
      volume: 'Âm lượng',
      effects: 'Hiệu ứng hình ảnh',
      soundEffects: 'Hiệu ứng âm thanh',
      autoPlay: 'Tự động chơi',
      totalScore: 'Tổng Điểm',
      keysPressed: 'Phím Đã Nhấn',
      keysPerMinute: 'Phím/Phút',
      time: 'Thời Gian',
      progress: 'Tiến Độ',
      startEnhancedGame: 'Bắt Đầu Trò Chơi Nâng Cao',
      quickPlay: 'Chơi Nhanh',
      backToMusic: 'Quay Lại Thư Viện Nhạc',
      enhancedPracticeTrack: '🎵 Bản Nhạc Luyện Tập Nâng Cao',
      gameSettings: {
        title: 'Cài Đặt Trò Chơi',
        audioSettings: 'Cài Đặt Âm Thanh',
        displaySettings: 'Cài Đặt Hiển Thị',
        showMusicNotation: 'Hiển Thị Ký Hiệu Âm Nhạc',
        showKeyGuide: 'Hiển Thị Hướng Dẫn Phím',
        pianoSize: 'Kích Thước Piano',
        small: 'Nhỏ',
        normal: 'Bình Thường',
        large: 'Lớn'
      },
      results: {
        title: 'Hoàn Thành Trò Chơi!',
        legendary: 'Huyền Thoại!',
        perfect: 'Hoàn Hảo!',
        excellent: 'Xuất Sắc!',
        great: 'Tuyệt Vời!',
        good: 'Tốt!',
        keepPracticing: 'Tiếp tục luyện tập!',
        rewardsEarned: 'Phần Thưởng Nhận Được',
        readyToClaim: 'Sẵn sàng nhận thưởng!'
      },
      piano: {
        brand: 'BIGCOIN PIANO',
        ready: 'SẴN SÀNG',
        disabled: 'VÔ HIỆU HÓA',
        octave3: 'Quãng 8 thứ 3',
        octave4: 'Quãng 8 thứ 4',
        octave5: 'Quãng 8 thứ 5',
        toggleNotation: 'Bật/Tắt Ký Hiệu Âm Nhạc',
        currentRate: 'Tỷ lệ hiện tại:',
        perKeyPress: 'mỗi lần nhấn phím'
      },
      proTip: {
        title: 'Mẹo Chuyên Nghiệp',
        description: 'Mỗi lần nhấn phím bạn kiếm được 10 BigCoins! Tập trung vào độ chính xác và tốc độ để tối đa hóa thu nhập.'
      }
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
      searchPlaceholder: 'Tìm theo tên bài hát hoặc nghệ sĩ...',
      noResults: 'Không tìm thấy nhạc',
      tryAdjustFilters: 'Thử từ khóa tìm kiếm khác',
      noMusicAvailable: 'Không có nhạc nào',
      playCount: 'Lượt chơi',
      averageScore: 'Điểm TB',
      addToFavorites: 'Thêm yêu thích',
      removeFromFavorites: 'Bỏ yêu thích',
      premiumOnly: 'Chỉ Premium',
      free: 'Miễn phí',
      mostPopular: 'Phổ Biến Nhất',
      newest: 'Mới Nhất',
      alphabetical: 'A-Z',
      allMusic: 'Tất Cả Nhạc',
      searchResults: 'Kết Quả Tìm Kiếm Cho',
      showingResults: 'Hiển thị',
      ofSongs: 'trong số',
      songs: 'bài hát',
      page: 'Trang',
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
        punk: 'Punk',
        practice: 'Luyện tập',
        wedding: 'Đám cưới'
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
      referralCodeDesc: 'Nhận 50 BigCoins thưởng với mã giới thiệu hợp lệ!',
      signInToAccount: 'Đăng nhập vào tài khoản BigCoin Piano của bạn',
      startEarning: 'Bắt đầu kiếm tiền mã hóa bằng cách chơi piano',
      chooseUsername: 'Chọn tên người dùng',
      enterEmail: 'Nhập email của bạn',
      createPassword: 'Tạo mật khẩu',
      confirmYourPassword: 'Xác nhận mật khẩu của bạn',
      enterReferralCode: 'Nhập mã giới thiệu để nhận thưởng',
      signUpForFree: 'Đăng ký miễn phí',
      signInHere: 'Đăng nhập tại đây',
      demo: 'Demo: demo@bigcoinpiano.com / password',
      benefits: {
        title: '🎹 Bắt Đầu Kiếm Tiền Ngay Hôm Nay!',
        welcomeBonus: '• 100 BigCoins thưởng chào mừng miễn phí',
        earnCoins: '• Kiếm coins cho mỗi nốt hoàn hảo',
        withdraw: '• Rút thành tiền thật hoặc crypto',
        accessSongs: '• Truy cập hàng nghìn bài hát'
      },
      validation: {
        usernameRequired: 'Tên người dùng là bắt buộc',
        usernameLength: 'Tên người dùng phải có ít nhất 3 ký tự',
        usernameFormat: 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới',
        emailRequired: 'Email là bắt buộc',
        emailInvalid: 'Email không hợp lệ',
        passwordRequired: 'Mật khẩu là bắt buộc',
        passwordLength: 'Mật khẩu phải có ít nhất 6 ký tự',
        confirmPasswordRequired: 'Vui lòng xác nhận mật khẩu',
        passwordMismatch: 'Mật khẩu không khớp',
        agreeTermsRequired: 'Bạn phải đồng ý với các điều khoản và điều kiện'
      }
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
      nextLevelProgress: 'Tiến độ cấp độ tiếp theo',
      totalBigcoins: 'Tổng BigCoins',
      quickPlayDefault: 'Chơi Nhanh (Nhạc Mặc Định)',
      browseMusicLibrary: 'Duyệt Thư Viện Nhạc',
      quickStart: 'Bắt Đầu Nhanh',
      quickStartDesc: 'Không muốn chọn? Nhấp "Chơi Nhanh" để bắt đầu kiếm tiền với bản nhạc luyện tập mặc định ngay lập tức!',
      startEarningNow: 'Bắt Đầu Kiếm Tiền Ngay'
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
      viewDetails: 'Xem chi tiết',
      manageYourPlatform: 'Quản lý nền tảng BigCoin Piano của bạn',
      administrator: 'Quản trị viên',
      userGrowth: 'Tăng Trưởng Người Dùng',
      revenueAnalytics: 'Phân Tích Doanh Thu',
      systemStatus: 'Trạng Thái Hệ Thống',
      serverUptime: 'Thời Gian Hoạt Động Máy Chủ',
      apiResponse: 'Phản Hồi API',
      activeConnections: 'Kết Nối Hoạt Động',
      errorRate: 'Tỷ Lệ Lỗi',
      recentTransactions: 'Giao Dịch Gần Đây',
      genreDistribution: 'Phân Phối Thể Loại',
      totalPlays: 'Tổng Lượt Chơi',
      popularGenres: 'Thể Loại Phổ Biến',
      topSongs: 'Bài Hát Hàng Đầu',
      accessDenied: 'Truy Cập Bị Từ Chối',
      noPermission: 'Bạn không có quyền truy cập trang này.',
      userDetails: 'Chi Tiết Người Dùng',
      accountInfo: 'Thông Tin Tài Khoản',
      balanceInfo: 'Thông Tin Số Dư',
      approve: 'Phê Duyệt',
      reject: 'Từ Chối'
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
      monthlyLimit: 'Giới hạn hàng tháng',
      manageWallet: 'Quản lý ví BigCoin và giao dịch của bạn',
      kycRequired: 'Yêu cầu xác minh KYC để rút tiền. Trạng thái hiện tại:',
      withdrawalSummary: 'Tóm Tắt Rút Tiền',
      amount: 'Số Tiền',
      fee: 'Phí',
      youllReceive: 'Bạn sẽ nhận được:',
      searchTransactions: 'Tìm kiếm giao dịch...',
      allStatus: 'Tất Cả Trạng Thái',
      export: 'Xuất',
      id: 'ID',
      type: 'Loại',
      status: 'Trạng Thái',
      description: 'Mô Tả',
      actions: 'Thao Tác',
      viewDetails: 'Xem Chi Tiết',
      earning: 'thu nhập',
      withdrawal: 'rút tiền',
      bonus: 'thưởng',
      directTransfer: 'Chuyển khoản trực tiếp vào tài khoản ngân hàng của bạn',
      digitalWalletDesc: 'PayPal, Skrill, hoặc các ví điện tử khác',
      cryptoDesc: 'Bitcoin, Ethereum, hoặc các loại tiền mã hóa khác',
      earningSummary: 'Tóm Tắt Thu Nhập',
      thisWeek: 'Tuần này:',
      thisMonth: 'Tháng này:',
      allTime: 'Tất cả thời gian:',
      minimumRequired: 'Yêu cầu tối thiểu 50 BC'
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
      perfectScore: 'Điểm hoàn hảo!',
      welcomeBack: 'Chào mừng trở lại, {username}!',
      registrationSuccess: 'Chào mừng đến với BigCoin Piano, {username}! Bạn đã nhận được 100 BigCoins thưởng!',
      profileUpdated: 'Cập nhật hồ sơ thành công',
      withdrawalSubmitted: 'Gửi yêu cầu rút tiền thành công!',
      rewardsClaimed: 'Nhận thưởng thành công!'
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
      permissionDenied: 'Không có quyền truy cập',
      audioPlaybackFailed: 'Không thể phát âm thanh',
      musicNotFound: 'Không tìm thấy nhạc, sử dụng nhạc mặc định',
      errorFetchingMusic: 'Lỗi tải nhạc, sử dụng nhạc mặc định'
    },
    notFound: {
      title: 'Oops! Không Tìm Thấy Trang',
      description: 'Trang bạn đang tìm kiếm dường như đã biến mất.',
      subDescription: 'Có thể nó đang học piano? 🎹',
      goHome: 'Về Trang Chủ',
      goBack: 'Quay Lại',
      browseMusicLibrary: 'Duyệt Thư Viện Nhạc'
    },
    footer: {
      company: 'Công ty',
      product: 'Sản phẩm',
      resources: 'Tài nguyên',
      legal: 'Pháp lý',
      aboutUs: 'Về chúng tôi',
      careers: 'Nghề nghiệp',
      press: 'Báo chí',
      blog: 'Blog',
      features: 'Tính năng',
      pricing: 'Giá cả',
      security: 'Bảo mật',
      support: 'Hỗ trợ',
      documentation: 'Tài liệu',
      apiReference: 'Tham khảo API',
      community: 'Cộng đồng',
      termsOfService: 'Điều khoản dịch vụ',
      privacyPolicy: 'Chính sách bảo mật',
      cookiePolicy: 'Chính sách cookie',
      contact: 'Liên hệ',
      followUs: 'Theo dõi chúng tôi',
      allRightsReserved: 'Tất cả quyền được bảo lưu.',
      bigcoinPiano: 'BigCoin Piano'
    }
  }
};

// Main reducer function - Fixed duplicate definition
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

export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, {
    ...initialState,
    translations: defaultTranslations
  });

  const setLanguage = (language) => {
    if (state.supportedLanguages.includes(language)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: language });
      localStorage.setItem('language', language);
      
      // Update document language
      document.documentElement.lang = language;
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
      console.warn(`Translation missing for key: ${key}`);
      return key; // Return key if no translation found
    }
    
    // Replace parameters
    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
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

  // Format numbers based on locale
  const formatNumber = (number) => {
    if (state.currentLanguage === 'vi') {
      return new Intl.NumberFormat('vi-VN').format(number);
    }
    return new Intl.NumberFormat('en-US').format(number);
  };

  // Format currency based on locale
  const formatCurrency = (amount, currency = 'USD') => {
    if (state.currentLanguage === 'vi') {
      if (currency === 'VND') {
        return new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(amount);
      }
      return `${amount.toLocaleString('vi-VN')} ${currency}`;
    }
    
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(amount);
    }
    return `${amount.toLocaleString('en-US')} ${currency}`;
  };

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && state.supportedLanguages.includes(savedLanguage)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: savedLanguage });
      document.documentElement.lang = savedLanguage;
    }
  }, [state.supportedLanguages]);

  // Update page title based on language
  useEffect(() => {
    const updatePageTitle = () => {
      const baseTitle = state.currentLanguage === 'vi' 
        ? 'BigCoin Piano - Đào tiền mã hóa bằng cách chơi piano'
        : 'BigCoin Piano - Mine cryptocurrency by playing piano';
      document.title = baseTitle;
    };

    updatePageTitle();
  }, [state.currentLanguage]);

  const value = {
    ...state,
    setLanguage,
    getLanguageName,
    t,
    formatRelativeTime,
    formatNumber,
    formatCurrency
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