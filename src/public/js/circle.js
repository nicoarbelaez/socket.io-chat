const InitCircleDrag = (socket) => {
  const $circle = document.getElementById('circle');
  if (!$circle) {
    console.error('initCircleDrag: elemento #circle no encontrado');
    return;
  }

  // Función que mueve el círculo y emite la posición
  const drag = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Obtener dimensiones del círculo
    const circleWidth = $circle.offsetWidth / 2;
    const circleHeight = $circle.offsetHeight / 2;

    // Calcular límites
    const maxX = window.innerWidth - circleWidth * 1.2;
    const maxY = window.innerHeight - circleHeight * 1.2;

    // Aplicar límites
    const clampedX = Math.max(circleWidth, Math.min(clientX, maxX));
    const clampedY = Math.max(circleHeight, Math.min(clientY, maxY));

    const position = {
      top: clampedY + 'px',
      left: clampedX + 'px',
    };

    setPosition(position);
    socket.emit('circle_position', position);
  };

  const setPosition = ({ top, left }) => {
    $circle.style.top = top;
    $circle.style.left = left;
  };

  // --- MOUSE EVENTS ---
  const onMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', drag);
  };
  const onMouseUp = () => {
    document.removeEventListener('mousemove', drag);
  };

  $circle.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);

  // --- TOUCH EVENTS ---
  const onTouchStart = (e) => {
    e.preventDefault();
    document.addEventListener('touchmove', drag, { passive: false });
  };
  const onTouchEnd = () => {
    document.removeEventListener('touchmove', drag);
  };

  $circle.addEventListener('touchstart', onTouchStart, { passive: false });
  document.addEventListener('touchend', onTouchEnd);

  // --- SOCKET INCOMING ---
  socket.on('circle_move', (position) => {
    setPosition(position);
  });

  // Opcional: devolver API para tests o manipulación externa
  return {
    setPosition,
    destroy: () => {
      $circle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      $circle.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      socket.off('circle_move');
    },
  };
};

export default InitCircleDrag;
