document.addEventListener('DOMContentLoaded', () => {
  const messagesContainer = document.getElementById('messagesContainer');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');

  // Función para añadir mensajes
  function addMessage(text, isSent) {
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
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Manejar envío de mensajes
  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, true);
      messageInput.value = '';
    }
  });

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });

  setTimeout(() => {
    addMessage('Sí, estaré ahí a las 3pm 👍', false);
  }, 1000);
});
