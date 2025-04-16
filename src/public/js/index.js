const socket = io();
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.querySelector('#messageInput');
const sendButton = document.querySelector('#sendButton');
const scrollToBottomButton = document.querySelector('#scrollToBottom');

let isAutoScrollEnabled = true;

const scrollToBottom = () => {
  messagesContainer.scrollTo({
    top: messagesContainer.scrollHeight,
    behavior: 'smooth',
  });
};

const handleScroll = () => {
  const threshold = 100;
  const fromBottom =
    messagesContainer.scrollHeight -
    messagesContainer.scrollTop -
    messagesContainer.clientHeight;

  isAutoScrollEnabled = fromBottom <= threshold;
  scrollToBottomButton.classList.toggle('visible', !isAutoScrollEnabled);
};

const addMessage = (text, isSent) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;

  const timestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  messageDiv.innerHTML = `
    <div class="text">${text}</div>
    <div class="timestamp">${timestamp} - ${isSent ? 'Yo' : 'Usuario'}</div>
  `;

  messagesContainer.appendChild(messageDiv);
  if (isAutoScrollEnabled) scrollToBottom();
};

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendButton.click();
});

scrollToBottomButton.addEventListener('click', scrollToBottom);
messagesContainer.addEventListener('scroll', handleScroll);

// Event listeners del DOM
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('send_message', message, socket.id); // Envía mensaje al servidor
    addMessage(message, true);
    messageInput.value = '';
  }
});

// Socket.IO handlers
socket.on('connect', () => {
  console.log('Conectado al servidor con ID:', socket.id);
  scrollToBottom();
});

socket.on('new_message', (message, socketid) => {
  console.log({ socketid });
  addMessage(message, false);
});

socket.on('connect_error', (err) => {
  console.error('Error de conexión:', err.message);
});

// Mensaje de prueba inicial
setTimeout(() => {
  addMessage('Sí, estaré ahí a las 3pm 👍', false);
}, 1000);
