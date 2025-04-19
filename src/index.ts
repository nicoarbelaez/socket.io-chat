// src/index.ts
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types/socket';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  addMessage,
  getAllRooms,
  getMessagesByRoom,
  Group,
} from './utils/message.js';
import { addSocketOnline, handleAuthentication } from './utils/socket.js';
import {
  addUser,
  getUserBySocketId,
  isUserOnline,
  setUserOnlineStatus,
} from './utils/users.js';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpServer = createServer(app);

const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer);

const configureStaticAssets = () => {
  const publicPath = path.join(__dirname, './public');
  app.use(express.static(publicPath));

  app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
};

io.on('connection', (socket) => {
  const username = socket.handshake.auth.username;

  // Inicializamos sala por defecto
  socket.data.connectedRoom = 'default';
  addSocketOnline(socket.id);

  console.log(
    `+ (${io.engine.clientsCount}) Nuevo cliente conectado ${socket.id}`
  );

  // Enviar grupos dinámicos
  const groups: Group[] = [
    { id: 1, name: 'Grupo Familiar', icon: '👨👩👧👦' },
    { id: 2, name: 'Equipo de Trabajo', icon: '💼' },
    { id: 3, name: 'Amigos', icon: '🎉' },
  ];
  socket.emit('update_groups', groups);

  // Verificación de autenticación al conectar
  if (!username) {
    socket.emit('request_authentication');
  } else {
    handleAuthentication(socket, username);
  }

  // Manejar disponibilidad de nombres de usuario
  socket.on('check_username', (username) => {
    const isOnline = isUserOnline(username);
    if (!isOnline) {
      addUser(username, socket.id);
    }
    socket.emit('username_availability', {
      available: !isOnline,
      username,
      message: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
    });
  });

  // Manejar el logout
  socket.on('logout', () => {
    const user = getUserBySocketId(socket.id);
    if (user) {
      setUserOnlineStatus(user.username, false);
    }
  });

  // Cuando llega un mensaje: lo agregamos y emitimos al resto de la sala
  socket.on('send_message', (content: string, timestamp: number) => {
    const roomId = socket.data.connectedRoom;
    const user = getUserBySocketId(socket.id);
    if (!user) {
      return;
    }

    const message = addMessage({
      roomId,
      userId: socket.id,
      username: user.username,
      content,
      timestamp,
    });

    io.to(roomId).emit('new_message', {
      content: message.content,
      username: message.username,
      timestamp: message.timestamp,
    });
  });

  // Sincronización de círculo (sin cambios)
  socket.on('circle_position', (position) =>
    socket.broadcast.emit('circle_move', position)
  );

  // Cambio de sala: salimos de la antigua, entramos a la nueva y enviamos su historial
  socket.on('connect_room', ({ groupId, groupName }) => {
    const room = `room-${groupId}`;
    const oldRoom = socket.data.connectedRoom;
    socket.leave(oldRoom);

    socket.join(room);
    socket.data.connectedRoom = room;

    const roomHistory = getMessagesByRoom(room);
    socket.emit('conversation', roomHistory);
    console.log(`[${room}] ${socket.id} se unido al grupo.`);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(
      `- (${io.engine.clientsCount}) Cliente desconectado ${socket.id}`
    );
    const user = getUserBySocketId(socket.id);
    if (user) {
      setUserOnlineStatus(user.username, false);
    }
  });
});

const configureRoutes = () => {
  app.get('/test', (req, res) => {
    res.json({ message: 'test' });
  });
};

const startServer = async () => {
  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

(async () => {
  configureStaticAssets();
  configureRoutes();
  await startServer();
})();
