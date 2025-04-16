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
  console.log(
    `+ (${io.engine.clientsCount}) Nuevo cliente conectado ${socket.id}`
  );

  socket.on('hello', () => {
    console.log("Evento 'hello' recibido desde el cliente");
  });

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
