import { ScreenManager } from './views/screen.view.js';
import { ChatService } from './services/chat.service.js';
import { ChatView } from './views/chat.view.js';
import { CircleView } from './views/circle.view.js';
import CookieManager from './utils/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const socket = io({
    auth: { username: CookieManager.getUsername() || '' },
    autoConnect: false,
  });

  ScreenManager.init(socket);
  const chatView = new ChatView(socket);
  new ChatService(socket, chatView);
  new CircleView(socket);
  socket.connect();
});
