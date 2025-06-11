// client/src/utils/index.js - Utility functions and helpers

// Token Manager
export const tokenManager = {
    getAccessToken() {
      return localStorage.getItem('accessToken');
    },
  
    getRefreshToken() {
      return localStorage.getItem('refreshToken');
    },
  
    setTokens(accessToken, refreshToken = null) {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
  
    clearTokens() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  
    isTokenExpired(token) {
      if (!token) return true;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
      } catch {
        return true;
      }
    }
  };
  
  // Formatters
  export const formatters = {
    // Format numbers with commas
    formatNumber(num) {
      if (num === null || num === undefined) return '0';
      return new Intl.NumberFormat().format(num);
    },
  
    // Format currency
    formatCurrency(amount, currency = 'USD') {
      const formatters = {
        USD: (amount) => `$${amount.toFixed(2)}`,
        VND: (amount) => `${amount.toLocaleString('vi-VN')} ₫`,
        SGD: (amount) => `S$${amount.toFixed(2)}`,
        BIGCOIN: (amount) => `${amount.toFixed(4)} BC`
      };
      
      return formatters[currency] ? formatters[currency](amount) : `${amount} ${currency}`;
    },
  
    // Format time duration
    formatTime(seconds) {
      if (!seconds || seconds < 0) return '0:00';
      
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
  
    // Format relative time (e.g., "2 hours ago")
    formatRelativeTime(date) {
      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now - past) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    },
  
    // Format percentage
    formatPercentage(value, decimals = 1) {
      return `${Number(value).toFixed(decimals)}%`;
    },
  
    // Format file size
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  };
  
  // Piano Constants
  export const PIANO_KEYS = [
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5'
  ];
  
  export const NOTE_FREQUENCIES = {
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25,
    'C#5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'E5': 659.25
  };
  
  // Validators
  export const validators = {
    email(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
  
    password(password) {
      return password && password.length >= 6;
    },
  
    username(username) {
      const re = /^[a-zA-Z0-9_]{3,30}$/;
      return re.test(username);
    },
  
    required(value) {
      return value !== null && value !== undefined && value !== '';
    },
  
    minLength(value, min) {
      return value && value.length >= min;
    },
  
    maxLength(value, max) {
      return value && value.length <= max;
    },
  
    numeric(value) {
      return !isNaN(value) && !isNaN(parseFloat(value));
    },
  
    positive(value) {
      return this.numeric(value) && parseFloat(value) > 0;
    },
  
    walletAddress(address) {
      // Basic validation for common crypto wallet formats
      const patterns = {
        bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
        ethereum: /^0x[a-fA-F0-9]{40}$/,
        usdt_erc20: /^0x[a-fA-F0-9]{40}$/
      };
      
      return Object.values(patterns).some(pattern => pattern.test(address));
    }
  };
  
  // Local Storage Helpers
  export const storage = {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },
  
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Failed to read from localStorage:', error);
        return defaultValue;
      }
    },
  
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove from localStorage:', error);
      }
    },
  
    clear() {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    }
  };
  
  // URL Helpers
  export const urlHelpers = {
    buildQuery(params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value);
          }
        }
      });
      return searchParams.toString();
    },
  
    parseQuery(queryString) {
      const params = new URLSearchParams(queryString);
      const result = {};
      for (const [key, value] of params) {
        result[key] = value;
      }
      return result;
    }
  };
  
  // Game Helpers
  export const gameHelpers = {
    calculateAccuracy(perfect, good, miss) {
      const total = perfect + good + miss;
      if (total === 0) return 0;
      return ((perfect + good) / total) * 100;
    },
  
    calculateScore(keystrokes, multiplier = 1) {
      let score = 0;
      let combo = 0;
      
      keystrokes.forEach(keystroke => {
        if (keystroke.accuracy === 'perfect') {
          score += 100 * multiplier * (1 + combo * 0.1);
          combo++;
        } else if (keystroke.accuracy === 'good') {
          score += 70 * multiplier * (1 + combo * 0.1);
          combo++;
        } else {
          combo = 0;
        }
      });
      
      return Math.floor(score);
    },
  
    getPerformanceGrade(accuracy) {
      if (accuracy >= 95) return { grade: 'S', color: 'text-yellow-400', desc: 'Perfect!' };
      if (accuracy >= 90) return { grade: 'A', color: 'text-green-400', desc: 'Excellent!' };
      if (accuracy >= 80) return { grade: 'B', color: 'text-blue-400', desc: 'Great!' };
      if (accuracy >= 70) return { grade: 'C', color: 'text-orange-400', desc: 'Good!' };
      return { grade: 'D', color: 'text-red-400', desc: 'Keep trying!' };
    },
  
    calculateCoinsEarned(score, accuracy, combo) {
      const baseCoins = score * 0.001; // 1 coin per 1000 points
      const accuracyBonus = accuracy >= 90 ? baseCoins * 0.5 : 0;
      const comboBonus = combo >= 50 ? baseCoins * 0.3 : 0;
      
      return Math.floor(baseCoins + accuracyBonus + comboBonus);
    }
  };
  
  // Device Detection
  export const deviceHelpers = {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
  
    isTablet() {
      return /iPad|Android/i.test(navigator.userAgent) && !this.isPhone();
    },
  
    isPhone() {
      return /iPhone|iPod|Android.*Mobile/i.test(navigator.userAgent);
    },
  
    isDesktop() {
      return !this.isMobile();
    },
  
    getTouchSupport() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
  
    getScreenSize() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1
      };
    }
  };
  
  // Color Helpers
  export const colorHelpers = {
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
  
    rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
  
    adjustBrightness(color, amount) {
      const rgb = this.hexToRgb(color);
      if (!rgb) return color;
      
      const adjust = (value) => Math.max(0, Math.min(255, value + amount));
      
      return this.rgbToHex(
        adjust(rgb.r),
        adjust(rgb.g),
        adjust(rgb.b)
      );
    }
  };
  
  // Debounce Helper
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Throttle Helper
  export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  // Random Helpers
  export const randomHelpers = {
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  
    randomFloat(min, max) {
      return Math.random() * (max - min) + min;
    },
  
    randomChoice(array) {
      return array[Math.floor(Math.random() * array.length)];
    },
  
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
  
    generateId() {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  };
  
  // Export individual utilities for easier importing
  export const { formatNumber, formatCurrency, formatTime, formatRelativeTime, formatPercentage, formatFileSize } = formatters;
  export { tokenManager, validators, storage, urlHelpers, gameHelpers, deviceHelpers, colorHelpers, debounce, throttle, randomHelpers };
  
  // Default export with all utilities
  export default {
    tokenManager,
    formatters,
    validators,
    storage,
    urlHelpers,
    gameHelpers,
    deviceHelpers,
    colorHelpers,
    debounce,
    throttle,
    randomHelpers,
    PIANO_KEYS,
    NOTE_FREQUENCIES
  };