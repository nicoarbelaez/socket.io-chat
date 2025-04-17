const UI = {
  init() {
    this.usernameScreen = document.getElementById('usernameScreen');
    this.groupScreen = document.getElementById('groupScreen');
    this.chatScreen = document.getElementById('chatScreen');
    this.backButton = document.getElementById('backButton');
    this.usernameForm = document.getElementById('usernameForm');
    this.groupList = document.getElementById('groupList');

    this.bindEvents();
  },

  bindEvents() {
    // Formulario de nombre de usuario
    this.usernameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('usernameInput').value;
      console.log('Nombre de usuario:', username);
      this.showScreen('groupScreen');
    });

    // Selección de grupo
    this.groupList.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        const groupId = e.target.dataset.groupId;
        console.log('Grupo seleccionado ID:', groupId);
        socket.emit('connect_room', groupId);
        this.showScreen('chatScreen');
      }
    });

    // Botón de regreso
    this.backButton.addEventListener('click', () => {
      this.showScreen('groupScreen');
    });
  },

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach((screen) => {
      screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
  },
};

document.addEventListener('DOMContentLoaded', () => UI.init());
