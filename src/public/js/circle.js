const InitCircleDrag = (socket) => {
  const $circle = document.getElementById('circle');
  if (!$circle) {
    console.error('initCircleDrag: elemento #circle no encontrado');
    return;
  }

  // Estado local para el bloqueo
  let isLocked = false;

  socket.emit('circle_get_position');

  const normalizeCoordinates = (clientX, clientY) => {
    const circleWidth = $circle.offsetWidth / 2;
    const circleHeight = $circle.offsetHeight / 2;

    const maxX = window.innerWidth - circleWidth * 1.2;
    const maxY = window.innerHeight - circleHeight * 1.2;

    return {
      top: Math.max(circleHeight, Math.min(clientY, maxY)),
      left: Math.max(circleWidth, Math.min(clientX, maxX)),
    };
  };

  const setPosition = ({ top, left, username, color }) => {
    const position = normalizeCoordinates(top, left);

    $circle.style.top =
      typeof position.top === 'number' ? `${position.top}px` : position.top;
    $circle.style.left =
      typeof position.left === 'number' ? `${position.left}px` : position.left;

    if (username) {
      $circle.setAttribute('title', `Movido por: ${username}`);
    }

    if (color) {
      $circle.style.backgroundColor = color;
    }

    // Actualizar cursor según el estado de bloqueo
    $circle.style.cursor = isLocked ? 'not-allowed' : 'grab';
  };

  // Función que maneja el arrastre
  const drag = (e) => {
    // No permitir el movimiento si está bloqueado
    if (isLocked) {
      return;
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Obtener coordenadas normalizadas
    const position = {
      top: clientX,
      left: clientY,
    };

    // Emitir solo las coordenadas normalizadas
    socket.emit('circle_position', position);

    // Aplicar posición localmente (sin username/color para movimiento propio)
    setPosition(position);
  };

  // --- MOUSE EVENTS ---
  const onMouseDown = (e) => {
    if (isLocked) {
      return; // No iniciar el arrastre si está bloqueado
    }
    e.preventDefault();
    $circle.style.cursor = 'grabbing';
    document.addEventListener('mousemove', drag);
  };
  const onMouseUp = () => {
    document.removeEventListener('mousemove', drag);
    $circle.style.cursor = isLocked ? 'not-allowed' : 'grab';
  };

  $circle.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);

  // --- TOUCH EVENTS ---
  const onTouchStart = (e) => {
    if (isLocked) {
      return; // No iniciar el arrastre si está bloqueado
    }
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

  socket.on('circle_move_islock', (locked) => {
    isLocked = locked;
    $circle.style.cursor = locked ? 'not-allowed' : 'grab';

    // Si se bloquea mientras se está moviendo, detener el movimiento
    if (locked) {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
    }
  });

  // API para tests o manipulación externa
  return {
    setPosition,
    normalizeCoordinates,
    destroy: () => {
      $circle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      $circle.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      socket.off('circle_move');
      socket.off('circle_move_islock');
    },
  };
};

export default InitCircleDrag;
