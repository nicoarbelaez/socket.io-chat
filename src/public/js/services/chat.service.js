import CookieManager from '../utils/auth.js';
import { $ } from '../utils/dom.js';
import { ScreenManager } from '../views/screen.view.js';

export class ChatService {
  constructor(socket, chatView) {
    this.socket = socket;
    this.chatView = chatView;
    this.initSocketHandlers();
  }

  initSocketHandlers() {
    this.socket.on('message_new', ({ id, content, user, timestamp }) => {
      this.chatView.addMessage({
        id,
        text: content,
        name: user.username,
        timestamp,
        isSent: false,
      });
    });

    this.socket.on('group_conversation', (messages) => {
      this.chatView.messagesContainer.innerHTML = '';
      messages.forEach(({ id, content, user: { username }, timestamp }) =>
        this.chatView.addMessage({
          id,
          text: content,
          name: username,
          timestamp,
          isSent: CookieManager.get('username') === username,
        })
      );
      this.chatView.scrollToBottom(true);
    });

    this.socket.on('user_availability', ({ available, user }) => {
      const messageError = $('messageError');
      if (available) {
        ScreenManager.showScreen('group');
        ScreenManager.updateUserInfo(user.username);
        messageError.textContent = '';
        messageError.classList.add('hidden');

        this.socket.emit('group_get');

        CookieManager.set('username', user.username);
        CookieManager.set('isAdmin', $('admin').checked);
        CookieManager.set('token', $('tokenInput').value);
      } else {
        CookieManager.clearAll();
        ScreenManager.showScreen('username');
        messageError.textContent = 'El usuario ya está en uso.';
        messageError.classList.remove('hidden');
      }
    });

    this.socket.on('group_updated', (groups) => {
      ScreenManager.updateGroupList(groups);
    });
  }
}
