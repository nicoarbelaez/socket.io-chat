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
    // this.checkExistingSession();
  },

  bindAuthEvents() {
    document.getElementById('usernameForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('usernameInput').value.trim();
      if (username) {
        this.socket.emit('check_username', username);
      }
    });

    document.getElementById('groupList').addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'LI') {
        this.handleGroupSelection(
          target.dataset.groupId,
          target.textContent.trim()
        );
      }
    });

    document.getElementById('backButton').addEventListener('click', () => {
      this.showScreen('group');
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
      CookieManager.clearSession();
      this.showScreen('username');
      this.socket.emit('logout');
    });

    this.socket.on('request_authentication', () => {
      this.showScreen('username');
    });
  },

  // checkExistingSession() {
  //   const username = CookieManager.getUsername();
  //   if (username) {
  //     this.showScreen('group');
  //     this.updateUserInfo(username);
  //   } else {
  //     this.showScreen('username');
  //   }
  // },

  updateUserInfo(username) {
    document.getElementById('currentUsername').textContent =
      `Usuario: ${decodeURIComponent(username)}`;
  },

  showScreen(screen) {
    Object.values(this.screens).forEach((s) => s.classList.remove('active'));
    this.screens[screen].classList.add('active');
  },

  handleGroupSelection(groupId, groupName) {
    document.getElementById('groupNameTitle').textContent = groupName;
    this.socket.emit('connect_room', { groupId, groupName });
    this.showScreen('chat');
  },
};

export default ScreenManager;
