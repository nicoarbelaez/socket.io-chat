import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { UserCache } from './cache/user.cache';
import { MessageCache } from './cache/message.cache';
import { GroupCache } from './cache/group.cache';
import { UserService } from './service/user.service';
import { MessageService } from './service/message.service';
import { GroupService } from './service/group.service';
import { UserGateway } from './gateway/user.gateway';
import { MessageGateway } from './gateway/message.gateway';
import { SocketServer } from './types/socket.types';
import { GatewayManager } from './gateway/gateway.manager';
import { GroupGateway } from './gateway/group.gateway';
import { CircleCache } from './cache/circle.cache';
import { CircleService } from './service/circle.service';
import { CircleGateway } from './gateway/circle.gateway';
import { NAMESPACE } from './config/const';

export function createApp() {
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer);

  // Crear namespaces
  const defaultNsp = io.of('/default');
  const adminNsp = io.of('/admin');

  // Configurar cachés
  const userCache = new UserCache();
  const messageCache = new MessageCache();
  const groupCache = new GroupCache();
  const circleCache = new CircleCache();

  // Inicializar servicios
  const userService = new UserService(userCache);
  const messageService = new MessageService(messageCache);
  const groupService = new GroupService(
    groupCache,
    messageService,
    userService
  );
  const circleService = new CircleService(circleCache);

  // Configurar gateways
  const socketServer: SocketServer = {
    io,
    namespaces: {
      admin: adminNsp,
      default: defaultNsp,
    },
  };
  const gatewayManager = new GatewayManager(socketServer);

  [NAMESPACE.ADMIN, NAMESPACE.DEFAULT].forEach((namespace) => {
    new UserGateway(socketServer, gatewayManager, userService, namespace);
    new MessageGateway(socketServer, gatewayManager, messageService, namespace);
    new GroupGateway(socketServer, gatewayManager, groupService, namespace);
    new CircleGateway(socketServer, gatewayManager, circleService, namespace);
  });

  return { app, httpServer };
}
