// Socket.IO service for real-time features
import { io } from 'socket.io-client';
import { tokenManager } from '../utils/tokenManager';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    const token = tokenManager.getAccessToken();
    if (!token) return;

    const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(socketURL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.reconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connected = false;
      this.reconnect();
    });

    this.socket.on('auth_error', (error) => {
      console.error('Socket auth error:', error);
      tokenManager.clearTokens();
      this.disconnect();
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (!this.connected) {
          this.connect();
        }
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }

  emit(event, data) {
    if (this.isConnected()) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Game-specific methods
  joinGame(sessionId) {
    this.emit('join_game', { sessionId });
  }

  leaveGame(sessionId) {
    this.emit('leave_game', { sessionId });
  }

  sendKeystroke(keystrokeData) {
    this.emit('player_keystroke', keystrokeData);
  }

  // Chat methods
  joinRoom(roomId) {
    this.emit('join_room', { roomId });
  }

  leaveRoom(roomId) {
    this.emit('leave_room', { roomId });
  }

  sendMessage(roomId, message) {
    this.emit('send_message', { roomId, message });
  }

  // Notification methods
  subscribeToNotifications() {
    this.emit('subscribe_notifications');
  }

  unsubscribeFromNotifications() {
    this.emit('unsubscribe_notifications');
  }
}

// Create singleton instance
export const socketService = new SocketService();

export default socketService;