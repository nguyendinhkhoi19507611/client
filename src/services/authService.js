// client/src/services/authService.js - Authentication API service
import api from './index';

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
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  async checkUsername(username) {
    const response = await api.get(`/auth/check-username/${username}`);
    return response.data;
  },

  async verifyReferral(code) {
    const response = await api.get(`/auth/verify-referral/${code}`);
    return response.data;
  },

  async requestPasswordReset(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  }
};