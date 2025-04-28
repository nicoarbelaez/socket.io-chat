import { $ } from '../utils/dom.js';

export class CircleView {
  constructor(socket) {
    this.socket = socket;
    this.circle = $('circle');
    this.isLocked = false;
    this.initDragEvents();
    this.initSocketHandlers();
    socket.emit('circle_get_position');
  }

  initDragEvents() {
    const drag = (e) => {
      if (this.isLocked) return;
      const clientX = e.touches?.[0]?.clientX || e.clientX;
      const clientY = e.touches?.[0]?.clientY || e.clientY;
      const position = this.normalizeCoordinates(clientX, clientY);
      this.socket.emit('circle_position', position);
      this.setPosition({ ...position, username: this.socket.auth.username });
    };

    this.circle.addEventListener('mousedown', (e) => {
      if (!this.isLocked) {
        e.preventDefault();
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', () =>
          document.removeEventListener('mousemove', drag)
        );
      }
    });

    this.circle.addEventListener('touchstart', (e) => {
      if (!this.isLocked) {
        e.preventDefault();
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', () =>
          document.removeEventListener('touchmove', drag)
        );
      }
    });
  }

  normalizeCoordinates(x, y) {
    return {
      top: Math.max(
        this.circle.offsetHeight / 2,
        Math.min(y, window.innerHeight - this.circle.offsetHeight / 2)
      ),
      left: Math.max(
        this.circle.offsetWidth / 2,
        Math.min(x, window.innerWidth - this.circle.offsetWidth / 2)
      ),
    };
  }

  setPosition({ top, left, username, color }) {
    this.circle.style.top = `${top}px`;
    this.circle.style.left = `${left}px`;
    if (username) this.circle.title = `Movido por: ${username}`;
    if (color) this.circle.style.backgroundColor = color;
  }

  initSocketHandlers() {
    this.socket.on('circle_move', (position) => this.setPosition(position));
    this.socket.on('circle_move_islock', (locked) => {
      console.log('locked', locked);
      if (!locked) {
        this.circle.title = `Libre 🫠`;
      }
      this.isLocked = locked;
      this.circle.style.cursor = locked ? 'not-allowed' : 'grab';
    });
  }
}
