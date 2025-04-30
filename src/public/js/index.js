import { ScreenManager } from './views/screen.view.js';
import { ChatService } from './services/chat.service.js';
import { ChatView } from './views/chat.view.js';
import { CircleView } from './views/circle.view.js';
import CookieManager from './utils/auth.js';

class SocketManager {
  constructor() {
    this.defaultSocket = null;
    this.adminSocket = null;
    this.currentSocket = null;

    this.init();
  }

  init() {
    this.defaultSocket = this.createSocket('/default');
    this.currentSocket = this.defaultSocket;
    ScreenManager.init(this);
  }

  createSocket(namespace, options = {}) {
    return io(namespace, {
      auth: {
        username: CookieManager.getUsername() || '',
        ...options,
      },
      autoConnect: false,
    });
  }

  async connectAsAdmin(token) {
    try {
      if (this.adminSocket?.connected) return;

      // Crear nueva instancia para namespace admin
      this.adminSocket = this.createSocket('/admin', { token });
      await this.switchConnection(this.adminSocket);
    } catch (error) {
      console.error('Admin connection error:', error);
      await this.connectAsDefault();
      throw error;
    }
  }

  async connectAsDefault() {
    if (this.defaultSocket?.connected) return;
    await this.switchConnection(this.defaultSocket);
  }

  async switchConnection(newSocket) {
    try {
      if (newSocket === null) {
        if (this.currentSocket?.connected) {
          await new Promise((resolve) => {
            this.currentSocket.once('disconnect', resolve);
            this.currentSocket.disconnect();
          });
        }
        this.currentSocket = null;
        return;
      }

      // Desconectar socket anterior si es diferente
      if (this.currentSocket && this.currentSocket !== newSocket) {
        await new Promise((resolve) => {
          this.currentSocket.once('disconnect', resolve);
          this.currentSocket.disconnect();
        });
      }

      // Configurar nuevos handlers solo si no están ya configurados
      if (!newSocket.hasListeners('connect')) {
        this.setupSocketHandlers(newSocket);
      }

      this.currentSocket = newSocket;

      if (!newSocket.connected) {
        await new Promise((resolve, reject) => {
          newSocket.connect();
          newSocket.once('connect', resolve);
          newSocket.once('connect_error', reject);
        });
      }
    } catch (error) {
      console.error('Connection switch failed:', error);
      throw error;
    }
  }

  setupSocketHandlers(socket) {
    // Inicializar componentes relacionados con el socket
    const chatView = new ChatView(socket);
    new ChatService(socket, chatView);
    new CircleView(socket);

    // Handler genérico de errores
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
      if (socket.nsp === '/admin') {
        ScreenManager.showError('Invalid admin credentials');
        this.connectAsDefault();
      }
    });

    // Reconexión automática con backoff
    socket.on('reconnect_attempt', (attempt) => {
      console.log(`Reconnection attempt ${attempt}, retrying in ${delay}ms`);
      setTimeout(() => socket.connect(), delay);
    });
  }

  getCurrentSocket() {
    return this.currentSocket;
  }

  isAdminConnection() {
    return this.currentSocket?.nsp === '/admin';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const socketManager = new SocketManager();

  console.log('Current namespace:', socketManager.getCurrentSocket()?.nsp);
});
