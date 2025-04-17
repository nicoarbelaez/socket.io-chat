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
import { addMessage, getMessagesByRoom, rooms } from './utils/message.js';
import { addSocketOnline } from './utils/socket.js';

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
  // 1) inicializamos sala por defecto
  socket.data.connectedRoom = 'default';
  addSocketOnline(socket.id);

  // 2) enviamos el histórico de la sala solo a este socket
  // const initialRoom = socket.data.connectedRoom;
  // const history = getMessagesByRoom(initialRoom);
  // io.to(socket.id).emit('conversation', history);

  console.log(
    `+ (${io.engine.clientsCount}) Nuevo cliente conectado ${socket.id}`
  );

  // 3) cuando llega un mensaje: lo agregamos y emitimos al resto de la sala
  socket.on('send_message', (content: string, timestamp: number) => {
    const roomId = socket.data.connectedRoom;
    const message = addMessage({
      roomId,
      userId: socket.id,
      content,
      timestamp,
    });

    socket.to(roomId).emit('new_message', message);
    console.log(JSON.stringify(rooms));
  });

  // 4) sincronización de círculo (sin cambios)
  socket.on('circle_position', (position) =>
    socket.broadcast.emit('circle_move', position)
  );

  // 5) cambio de sala: salimos de la antigua, entramos a la nueva y enviamos su historial
  socket.on('connect_room', (newRoomId: string) => {
    const oldRoom = socket.data.connectedRoom;
    socket.leave(oldRoom);

    socket.join(newRoomId);
    socket.data.connectedRoom = newRoomId;

    const roomHistory = getMessagesByRoom(newRoomId);
    console.log(socket.id, socket.data.connectedRoom);
    io.to(socket.id).emit('conversation', roomHistory);
  });

  // 6) desconexión
  socket.on('disconnect', () => {
    console.log(
      `- (${io.engine.clientsCount}) Cliente desconectado ${socket.id}`
    );
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
