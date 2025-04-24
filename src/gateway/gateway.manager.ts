import { AppSocket, SocketServer } from '../types/socket.types';
import { BaseGateway } from './base.gateway';

export type ConnectionHandler = (socket: AppSocket) => void;

export class GatewayManager {
  private connectionHandlers: ConnectionHandler[] = [];
  private server: SocketServer;

  constructor(server: SocketServer) {
    this.server = server;
    this.setupConnection();
  }

  private setupConnection(): void {
    this.server.io.on('connection', (socket: AppSocket) => {
      console.log(
        `[Server +] Client conected ${socket.id} (${this.server.io.engine.clientsCount})`
      );
      this.connectionHandlers.forEach((handler) => handler(socket));
    });
  }

  registerGateway(handler: ConnectionHandler): void {
    this.connectionHandlers.push(handler);
  }
}
