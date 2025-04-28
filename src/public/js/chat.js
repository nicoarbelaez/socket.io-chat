import CookieManager from './auth.js';
import ScreenManager from './ui.js';

export const initChat = (socket) => {
  const messagesContainer = document.getElementById('messagesContainer');
  const messageInput = document.querySelector('#messageInput');
  const $messageError = document.getElementById('messageError');
  const sendButton = document.querySelector('#sendButton');
  const scrollToBottomButton = document.querySelector('#scrollToBottom');

  let isAutoScrollEnabled = true;

  const setupEventListeners = () => {
    messageInput.addEventListener(
      'keypress',
      (e) => e.key === 'Enter' && sendButton.click()
    );
    scrollToBottomButton.addEventListener('click', scrollToBottom);
    messagesContainer.addEventListener('scroll', handleScroll);
    sendButton.addEventListener('click', handleMessageSend);

    document
      .getElementById('chatScreen')
      .addEventListener('transitionend', () => {
        if (
          document.getElementById('chatScreen').classList.contains('active')
        ) {
          scrollToBottom(true); // Forzar scroll al entrar al chat
        }
      });
  };

  const handleMessageSend = () => {
    const content = messageInput.value.trim();
    if (content) {
      const timestamp = Date.now();
      socket.emit('message_send', content);
      addMessage({ text: content, timestamp, isSent: true });
      messageInput.value = '';
    }
  };

  const scrollToBottom = (force = false) => {
    if (!force && !isAutoScrollEnabled) return;

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const hasScroll =
      messagesContainer.scrollHeight > messagesContainer.clientHeight;
    if (!hasScroll) {
      scrollToBottomButton.classList.add('hidden');
      return;
    }
    const fromBottom =
      messagesContainer.scrollHeight -
      messagesContainer.scrollTop -
      messagesContainer.clientHeight;
    isAutoScrollEnabled = fromBottom <= 50;
    scrollToBottomButton.classList.toggle('hidden', isAutoScrollEnabled);
  };

  const addMessage = ({ id, text, name, timestamp, isSent }) => {
    const date = new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Crear el contenedor del mensaje
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isSent ? 'message-sent' : 'message-received');
    messageDiv.dataset.groupName = id;

    // Si es mensaje recibido, agregar nombre
    if (!isSent) {
      const nameDiv = document.createElement('div');
      nameDiv.classList.add('message-username');
      nameDiv.textContent = name;
      messageDiv.appendChild(nameDiv);
    }

    // Contenido del mensaje
    const textNode = document.createTextNode(text);
    messageDiv.appendChild(textNode);

    // Timestamp
    const statusSpan = document.createElement('span');
    statusSpan.classList.add('message-status');
    statusSpan.textContent = `${date} ✓`;
    messageDiv.appendChild(statusSpan);

    // Agregar al contenedor
    messagesContainer.appendChild(messageDiv);

    isAutoScrollEnabled && scrollToBottom();
    // Verificar scroll y auto-scroll si está habilitado
    handleScroll();
  };

  const setupSocketHandlers = () => {
    socket.on('connect', () => {
      console.log('Conectado al servidor con ID:', socket.id);
      scrollToBottom(true); // Forzar scroll al conectar
    });

    socket.on(
      'message_new',
      ({ id, content, user: { username }, timestamp }) => {
        addMessage({
          id,
          text: content,
          name: username,
          timestamp,
          isSent: false,
        });
      }
    );

    socket.on('group_conversation', (messages) => {
      messagesContainer.innerHTML = '';
      messages.forEach(({ id, content, user: { username }, timestamp }) =>
        addMessage({
          id,
          text: content,
          name: username,
          timestamp,
          isSent: CookieManager.getUsername() === username,
        })
      );
      scrollToBottom(true); // Forzar scroll al cargar conversación
    });

    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
    });

    socket.on('user_availability', ({ available, user }) => {
      if (available) {
        CookieManager.setUsername(user.username);
        ScreenManager.showScreen('group');
        ScreenManager.updateUserInfo(user.username);
        $messageError.textContent = '';
        $messageError.classList.add('hidden');
        socket.emit('group_get');
      } else {
        CookieManager.clearSession();
        ScreenManager.showScreen('username');
        $messageError.textContent = 'El usuario ya está en uso.';
        $messageError.classList.remove('hidden');
      }
    });

    socket.on('group_updated', (groups) => {
      const groupList = document.getElementById('groupList');
      groupList.innerHTML = groups
        .map(
          ({ id, name, icon }) => `
        <li class="group-item" data-group-id="${id}" data-group-name="${name}">
          <div class="group-info">
            <h3 class="group-name">${name} ${icon || ''}</h3>
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
    });

    socket.on('room_connected', ({ groupName }) => {
      document.getElementById('groupNameTitle').textContent = groupName;
      scrollToBottom(true); // Forzar scroll al entrar a una sala
    });
  };

  // Inicialización
  setupEventListeners();
  setupSocketHandlers();
};
