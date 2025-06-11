// client/src/services/index.js - API services setup and configuration
import axios from 'axios';
import { tokenManager } from '@utils/tokenManager';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh', {
            refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          tokenManager.setTokens(accessToken, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth Service
export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data.user;
  },

  async changePassword(passwordData) {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  async refreshToken() {
    const refreshToken = tokenManager.getRefreshToken();
    const response = await axios.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },

  async checkUsername(username) {
    const response = await api.get(`/auth/check-username/${username}`);
    return response.data;
  },

  async verifyReferral(code) {
    const response = await api.get(`/auth/verify-referral/${code}`);
    return response.data;
  }
};

// Game Service
export const gameService = {
  async startGame(musicId, settings = {}) {
    const response = await api.post('/game/start', { musicId, settings });
    return response.data;
  },

  async processKeystroke(sessionId, keystrokeData) {
    const response = await api.post(`/game/${sessionId}/keystroke`, keystrokeData);
    return response.data;
  },

  async endGame(sessionId, endData = {}) {
    const response = await api.post(`/game/${sessionId}/end`, endData);
    return response.data;
  },

  async claimRewards(sessionId) {
    const response = await api.post(`/game/${sessionId}/claim-rewards`);
    return response.data;
  },

  async pauseGame(sessionId) {
    const response = await api.post(`/game/${sessionId}/pause`);
    return response.data;
  },

  async resumeGame(sessionId) {
    const response = await api.post(`/game/${sessionId}/resume`);
    return response.data;
  },

  async abandonGame(sessionId) {
    const response = await api.post(`/game/${sessionId}/abandon`);
    return response.data;
  },

  async getGameSession(sessionId) {
    const response = await api.get(`/game/${sessionId}`);
    return response.data;
  },

  async getPlayerStats(period = '30d') {
    const response = await api.get(`/game/stats/player?period=${period}`);
    return response.data;
  },

  async getLeaderboard(period = '30d', limit = 100) {
    const response = await api.get(`/game/leaderboard?period=${period}&limit=${limit}`);
    return response.data;
  },

  async getGameHistory(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/game/history?${params}`);
    return response.data;
  },

  async getAnalytics(gameId) {
    const response = await api.get(`/game/${gameId}/analytics`);
    return response.data;
  },

  async validateSession(sessionId) {
    const response = await api.post('/game/validate-session', { sessionId });
    return response.data;
  }
};

// Music Service
export const musicService = {
  async searchMusic(params) {
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
    const response = await api.get(`/music/search?${searchParams}`);
    return response.data;
  },

  async getMusicById(id) {
    const response = await api.get(`/music/${id}`);
    return response.data;
  },

  async getMusicPreview(id, duration = 30) {
    const response = await api.get(`/music/${id}/preview?duration=${duration}`);
    return response.data;
  },

  async getTrendingMusic(period = '7d', limit = 20) {
    const response = await api.get(`/music/trending?period=${period}&limit=${limit}`);
    return response.data;
  },

  async getRecommendations(limit = 10) {
    const response = await api.get(`/music/recommendations?limit=${limit}`);
    return response.data;
  },

  async getFeaturedMusic(limit = 10) {
    const response = await api.get(`/music/featured?limit=${limit}`);
    return response.data;
  },

  async getGenres() {
    const response = await api.get('/music/genres');
    return response.data;
  },

  async toggleLike(musicId) {
    const response = await api.post(`/music/${musicId}/like`);
    return response.data;
  },

  async getLikedMusic(page = 1, limit = 20) {
    const response = await api.get(`/music/liked?page=${page}&limit=${limit}`);
    return response.data;
  },

  async reportMusic(musicId, type, description) {
    const response = await api.post(`/music/${musicId}/report`, { type, description });
    return response.data;
  },

  async getMusicByDifficulty(level, page = 1, limit = 20) {
    const response = await api.get(`/music/by-difficulty/${level}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getNewReleases(limit = 20) {
    const response = await api.get(`/music/new-releases?limit=${limit}`);
    return response.data;
  },

  async getTopCharts(period = '7d', limit = 50) {
    const response = await api.get(`/music/charts/top?period=${period}&limit=${limit}`);
    return response.data;
  },

  async getRandomMusic(count = 5, filters = {}) {
    const params = new URLSearchParams({ count, ...filters });
    const response = await api.get(`/music/random?${params}`);
    return response.data;
  },

  async getMusicLeaderboard(musicId, limit = 10) {
    const response = await api.get(`/music/${musicId}/leaderboard?limit=${limit}`);
    return response.data;
  },

  async getMusicByArtist(artist, page = 1, limit = 20) {
    const response = await api.get(`/music/artist/${encodeURIComponent(artist)}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getMusicStats() {
    const response = await api.get('/music/stats/overview');
    return response.data;
  }
};

// Payment Service
export const paymentService = {
  async processWithdrawal(amount, method, accountInfo) {
    const response = await api.post('/payment/withdraw', { amount, method, accountInfo });
    return response.data;
  },

  async processDeposit(amount, paymentMethodId, currency = 'USD') {
    const response = await api.post('/payment/deposit', { amount, paymentMethodId, currency });
    return response.data;
  },

  async getBalance() {
    const response = await api.get('/payment/balance');
    return response.data;
  },

  async getTransactionHistory(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/payment/history?${params}`);
    return response.data;
  },

  async getExchangeRates() {
    const response = await api.get('/payment/exchange-rates');
    return response.data;
  },

  async convertCurrency(amount, fromCurrency, toCurrency) {
    const response = await api.post('/payment/convert', { amount, fromCurrency, toCurrency });
    return response.data;
  },

  async subscribeToPremium(plan, paymentMethodId) {
    const response = await api.post('/payment/premium/subscribe', { plan, paymentMethodId });
    return response.data;
  },

  async cancelSubscription() {
    const response = await api.post('/payment/premium/cancel');
    return response.data;
  },

  async calculateFees(amount, type, method) {
    const response = await api.get(`/payment/fees/calculate?amount=${amount}&type=${type}&method=${method}`);
    return response.data;
  },

  async getWithdrawalMethods() {
    const response = await api.get('/payment/withdrawal-methods');
    return response.data;
  },

  async getTransactionDetails(transactionId) {
    const response = await api.get(`/payment/transaction/${transactionId}`);
    return response.data;
  },

  async getPaymentStats(period = '30d') {
    const response = await api.get(`/payment/stats?period=${period}`);
    return response.data;
  },

  async validateWallet(address, currency = 'USDT') {
    const response = await api.post('/payment/validate-wallet', { address, currency });
    return response.data;
  }
};

// User Service
export const userService = {
  async getUserProfile(userId) {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  async updateAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteAccount(password) {
    const response = await api.delete('/auth/account', { data: { password } });
    return response.data;
  }
};

// KYC Service
export const kycService = {
  async submitKYC(kycData) {
    const response = await api.post('/kyc/submit', kycData);
    return response.data;
  },

  async uploadDocument(type, file) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    const response = await api.post('/kyc/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getKYCStatus() {
    const response = await api.get('/kyc/status');
    return response.data;
  }
};

// Admin Service (for admin users)
export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  async getUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  async getPendingWithdrawals() {
    const response = await api.get('/admin/withdrawals/pending');
    return response.data;
  },

  async approveWithdrawal(transactionId) {
    const response = await api.post(`/admin/withdrawals/${transactionId}/approve`);
    return response.data;
  },

  async rejectWithdrawal(transactionId, reason) {
    const response = await api.post(`/admin/withdrawals/${transactionId}/reject`, { reason });
    return response.data;
  },

  async getFinancialReport(period = '30d') {
    const response = await api.get(`/admin/reports/financial?period=${period}`);
    return response.data;
  }
};

// Utility functions for API calls
export const apiUtils = {
  // Handle API errors consistently
  handleError(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Create form data for file uploads
  createFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });
    return formData;
  },

  // Build query string from object
  buildQueryString(params) {
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
  }
};