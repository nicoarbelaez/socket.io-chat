const socket = io();
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.querySelector('#messageInput');
const sendButton = document.querySelector('#sendButton');
const scrollToBottomButton = document.querySelector('#scrollToBottom');

let isAutoScrollEnabled = true;

document.getElementById('chatScreen').addEventListener('transitionend', () => {
  if (document.getElementById('chatScreen').classList.contains('active')) {
    scrollToBottom();
  }
});

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

const addMessage = ({ text, name, timestamp, isSent }) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;

  const date = new Date(timestamp);
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  messageDiv.innerHTML = `
    <div class="text">${text}</div>
    <div class="timestamp">${formattedTime} - ${isSent ? 'Yo' : name}</div>
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
    const timestamp = Date.now();
    socket.emit('send_message', message, timestamp); // Envía mensaje al servidor
    addMessage({ text: message, timestamp, isSent: true });
    messageInput.value = '';
  }
});

// Socket.IO handlers
socket.on('connect', () => {
  console.log('Conectado al servidor con ID:', socket.id);
  scrollToBottom();
});

socket.on('new_message', ({ content, userId, timestamp, name }) => {
  const isSent = userId == socket.id;
  if (isSent) {
    return;
  }
  addMessage({ text: content, name, timestamp, isSent });
});

socket.on('conversation', (messages) => {
  messagesContainer.innerHTML = '';

  messages.forEach(({ content, userId, timestamp, name }) => {
    const isSent = userId === socket.id;
    addMessage({ text: content, name, timestamp, isSent });
  });
});

socket.on('connect_error', (err) => {
  console.error('Error de conexión:', err.message);
});
