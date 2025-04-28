import { $, $$ } from '../utils/dom.js';

export class ChatView {
  constructor(socket) {
    this.socket = socket;
    this.messagesContainer = $('messagesContainer');
    this.messageInput = $$('#messageInput');
    this.sendButton = $$('#sendButton');
    this.scrollToBottomButton = $$('#scrollToBottom');
    this.isAutoScrollEnabled = true;

    this.initEventListeners();
  }

  initEventListeners() {
    this.messageInput.addEventListener(
      'keypress',
      (e) => e.key === 'Enter' && this.sendButton.click()
    );
    this.scrollToBottomButton.addEventListener('click', () =>
      this.scrollToBottom()
    );
    this.messagesContainer.addEventListener('scroll', () =>
      this.handleScroll()
    );
    this.sendButton.addEventListener('click', () => this.handleMessageSend());
  }

  handleMessageSend() {
    const content = this.messageInput.value.trim();
    if (content) {
      this.socket.emit('message_send', content);
      this.addMessage({ text: content, timestamp: Date.now(), isSent: true });
      this.messageInput.value = '';
    }
  }

  addMessage({ id, text, name, timestamp, isSent }) {
    const date = new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const messageDiv = document.createElement('div');
    messageDiv.classList.add(
      'message',
      isSent ? 'message-sent' : 'message-received'
    );
    messageDiv.dataset.groupName = id;

    if (!isSent) {
      const nameDiv = document.createElement('div');
      nameDiv.classList.add('message-username');
      nameDiv.textContent = name;
      messageDiv.appendChild(nameDiv);
    }

    messageDiv.appendChild(document.createTextNode(text));

    const statusSpan = document.createElement('span');
    statusSpan.classList.add('message-status');
    statusSpan.textContent = `${date} ✓`;
    messageDiv.appendChild(statusSpan);

    this.messagesContainer.appendChild(messageDiv);
    this.handleScroll();
  }

  scrollToBottom(force = false) {
    if (force || this.isAutoScrollEnabled) {
      this.messagesContainer.scrollTo({
        top: this.messagesContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  handleScroll() {
    const fromBottom =
      this.messagesContainer.scrollHeight -
      this.messagesContainer.scrollTop -
      this.messagesContainer.clientHeight;
    this.isAutoScrollEnabled = fromBottom <= 50;
    this.scrollToBottomButton.classList.toggle(
      'hidden',
      this.isAutoScrollEnabled
    );
  }
}
