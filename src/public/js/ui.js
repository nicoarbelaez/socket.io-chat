import CookieManager from './auth.js';

const ScreenManager = {
  init(socket) {
    this.socket = socket;
    this.screens = {
      username: document.getElementById('usernameScreen'),
      group: document.getElementById('groupScreen'),
      chat: document.getElementById('chatScreen'),
    };

    this.bindAuthEvents();
  },

  bindAuthEvents() {
    document.getElementById('usernameForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('usernameInput').value.trim();
      if (username) {
        this.socket.emit('user_register', username);
      }
    });

    document.getElementById('groupList').addEventListener('click', (e) => {
      const groupItem = e.target.closest('.group-item');
      if (groupItem) {
        const groupId = groupItem.dataset.groupId;
        const groupNameElement = groupItem.querySelector('.group-name');
        const groupName = groupNameElement
          ? groupNameElement.textContent.trim()
          : 'Hubo un error';

        this.handleGroupSelection(groupId, groupName);
      }
    });

    document.getElementById('backButton').addEventListener('click', () => {
      this.socket.emit('group_leave');
      this.showScreen('group');
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
      CookieManager.clearSession();
      this.showScreen('username');
      this.socket.emit('user_logout');
    });

    this.socket.on('session_expired', () => {
      this.showScreen('username');
    });
  },

  updateUserInfo(username) {
    document.getElementById('currentUsername').textContent =
      `${decodeURIComponent(username)}`;
  },

  showScreen(screen) {
    Object.values(this.screens).forEach((s) => {
      s.classList.remove('screen');
      s.classList.add('hidden');
    });
    this.screens[screen].classList.remove('hidden');
    this.screens[screen].classList.add('screen');
  },

  handleGroupSelection(roomId, groupName) {
    document.getElementById('groupNameTitle').textContent = groupName;
    this.socket.emit('group_join', roomId);
    this.showScreen('chat');
  },
};

export default ScreenManager;
