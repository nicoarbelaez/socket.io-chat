const socket = io();

const checkSocketStatus = () => {
  console.log(`Estado del socket: ${socket.connected}`);
};

socket.on('connect', () => {
  console.log('Conexión establecida ID:', socket.id);
  checkSocketStatus();
});

socket.on('disconnect', () => {
  console.log('Conexión perdida');
});

socket.on('connect_error', (err) => {
  console.error('Error de conexión:', err.message);
});

socket.io.on('reconnect_attempt', () => {
  console.log('Intentando reconexión');
});

socket.io.on('reconnect', () => {
  console.log('Reconexión');
});
