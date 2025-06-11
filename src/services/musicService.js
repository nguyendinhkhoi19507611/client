//  Music API service
import api from './index';

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