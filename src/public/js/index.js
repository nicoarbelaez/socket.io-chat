import ScreenManager from './ui.js';
import { initChat } from './chat.js';
import CookieManager from './auth.js';
import InitCircleDrag from './circle.js';

// Inicialización principal
document.addEventListener('DOMContentLoaded', () => {
  const socket = io({
    auth: {
      username: CookieManager.getUsername() || '',
    },
    autoConnect: false,
  });

  ScreenManager.init(socket);
  InitCircleDrag(socket);
  initChat(socket);
  socket.connect();
});
