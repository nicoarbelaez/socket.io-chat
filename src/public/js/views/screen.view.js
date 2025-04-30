import { $ } from '../utils/dom.js';
import CookieManager from '../utils/auth.js';

export const ScreenManager = {
  init(socketManager) {
    this.socketManager = socketManager;
    this.socket = null;
    this.screens = {
      username: $('usernameScreen'),
      group: $('groupScreen'),
      chat: $('chatScreen'),
    };
    this.bindAuthEvents();
  },

  bindAuthEvents() {
    $('usernameForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = $('usernameInput').value.trim();
      const isAdmin = $('admin').checked;
      const token = $('tokenInput').value;
      const messageErrorToken = $('messageErrorToken');

      if (!username) return;

      messageError.classList.add('hidden');
      if (isAdmin && !token) {
        messageErrorToken.textContent = 'El token es requerido.';
        messageErrorToken.classList.remove('hidden');
        return;
      }

      if (isAdmin && token) {
        // Conexión admin
        await this.socketManager.connectAsAdmin(token);
      } else {
        // Conexión default
        await this.socketManager.connectAsDefault();
      }

      this.socket = this.socketManager.getCurrentSocket();
      this.socket.emit('user_register', username);
    });

    $('groupList').addEventListener('click', (e) => {
      const groupItem = e.target.closest('.group-item');
      if (groupItem) {
        const groupNameElement = groupItem.querySelector('.group-name');
        const groupName = groupNameElement
          ? groupNameElement.textContent.trim()
          : 'Hubo un error';

        this.handleGroupSelection(groupItem.dataset.groupId, groupName);
      }
    });

    $('backButton').addEventListener('click', () => {
      this.socket.emit('group_leave');
      this.showScreen('group');
    });

    $('logoutButton').addEventListener('click', async () => {
      CookieManager.clearSession();
      this.showScreen('username');
      this.socket.emit('user_logout');
      await this.socketManager.switchConnection(null);
    });
  },

  updateUserInfo(username) {
    $('currentUsername').textContent = decodeURIComponent(username);
  },

  showScreen(screen) {
    Object.values(this.screens).forEach((s) => {
      s.classList.remove('screen');
      s.classList.add('hidden');
    });
    this.screens[screen].classList.remove('hidden');
    this.screens[screen].classList.add('screen');
  },

  updateGroupList(groups) {
    $('groupList').innerHTML = groups
      .map(
        (g) => `
      <li class="group-item" data-group-id="${g.id}" data-group-name="${g.name}">
        <div class="group-info">
          <h3 class="group-name">${g.name} ${g.icon || ''}</h3>
          <p class="group-last-message">Último mensaje 1</p>
        </div>
        <span class="notification-badge">
          <span class="notification-ping"></span>
          <span class="notification-circle">4</span>
        </span>
      </li>
    `
      )
      .join('');
  },

  handleGroupSelection(roomId, groupName) {
    $('groupNameTitle').textContent = groupName;
    this.socket.emit('group_join', roomId);
    this.showScreen('chat');
  },
};
