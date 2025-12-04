/**
 * Socket Service
 * WebSocket connection management for authenticated users
 */

import { SOCKET_URL } from '@/constants';
import { tokenStorage } from '@/utils/tokenStorage';

type SocketEventCallback = (data: any) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<string, Set<SocketEventCallback>> = new Map();
  private isConnecting = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkInterval = setInterval(() => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            clearInterval(checkInterval);
            resolve();
          } else if (!this.isConnecting) {
            clearInterval(checkInterval);
            reject(new Error('Connection failed'));
          }
        }, 100);
        return;
      }

      this.isConnecting = true;
      const accessToken = tokenStorage.getAccessToken();

      if (!accessToken) {
        this.isConnecting = false;
        reject(new Error('No access token available'));
        return;
      }

      try {
        const wsUrl = `${SOCKET_URL}/ws?token=${accessToken}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          console.log('Socket connected');
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing socket message:', error);
          }
        };

        this.socket.onerror = (error) => {
          this.isConnecting = false;
          console.error('Socket error:', error);
          reject(error);
        };

        this.socket.onclose = () => {
          this.isConnecting = false;
          console.log('Socket disconnected');
          this.attemptReconnect();
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      if (tokenStorage.hasTokens()) {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  private handleMessage(message: any) {
    const { type, data } = message;
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      handlers.forEach((callback) => callback(data));
    }
  }

  on(event: string, callback: SocketEventCallback) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(callback);
  }

  off(event: string, callback: SocketEventCallback) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: event, data }));
    } else {
      console.warn('Socket is not connected. Cannot emit event:', event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.eventHandlers.clear();
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const socketService = new SocketService();

