const $circle = document.querySelector('#circle');

const drag = (e) => {
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const position = { top: clientY + 'px', left: clientX + 'px' };

  setPosition(position);
  socket.emit('circle_position', position);
};

const setPosition = ({ top, left }) => {
  $circle.style.top = top;
  $circle.style.left = left;
};

$circle.addEventListener('mousedown', (e) => {
  e.preventDefault();
  document.addEventListener('mousemove', drag);
});

document.addEventListener('mouseup', () => {
  document.removeEventListener('mousemove', drag);
});

$circle.addEventListener('touchstart', (e) => {
  e.preventDefault();
  document.addEventListener('touchmove', drag, { passive: false });
});

document.addEventListener('touchend', () => {
  document.removeEventListener('touchmove', drag);
});

socket.on('circle_move', (position) => {
  setPosition(position);
});
