const $circle = document.querySelector('#circle');

const drag = (e) => {
  const position = { top: e.clientY + 'px', left: e.clientX + 'px' };

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

document.addEventListener('mouseup', (e) => {
  e.set;
  document.removeEventListener('mousemove', drag);
});

socket.on('circle_move', (position) => {
  setPosition(position);
});
