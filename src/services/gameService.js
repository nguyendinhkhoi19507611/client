// client/src/services/gameService.js - Game API service
import api from './index';

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