

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
    },
  
    getUserFromToken(token) {
      if (!token) return null;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user || null;
      } catch {
        return null;
      }
    }
  };