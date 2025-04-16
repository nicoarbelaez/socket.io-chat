document.addEventListener('DOMContentLoaded', () => {
  const messagesContainer = document.getElementById('messagesContainer');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const scrollToBottomButton = document.getElementById('scrollToBottom');
  let isAutoScrollEnabled = true;

  const scrollToBottom = () => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth',
    });
  };

  messagesContainer.addEventListener('scroll', () => {
    const threshold = 100;
    const fromBottom =
      messagesContainer.scrollHeight -
      messagesContainer.scrollTop -
      messagesContainer.clientHeight;

    isAutoScrollEnabled = fromBottom <= threshold;
    scrollToBottomButton.classList.toggle('visible', !isAutoScrollEnabled);
  });

  scrollToBottomButton.addEventListener('click', scrollToBottom);

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

    if (isAutoScrollEnabled) {
      scrollToBottom();
    }
  }

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

  // Scroll inicial al cargar
  setTimeout(scrollToBottom, 100);
});
