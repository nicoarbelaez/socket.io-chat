import { AppSocket, SocketServer } from '../types/socket.types';

export type ConnectionHandler = (socket: AppSocket) => void;

export class GatewayManager {
  private handlers: Record<string, ConnectionHandler[]> = {
    admin: [],
    default: [],
  };
  private server: SocketServer;

  constructor(server: SocketServer) {
    this.server = server;
    this.setupNamespaces();
  }

  private setupNamespaces(): void {
    Object.entries(this.server.namespaces).forEach(([name, nsp]) => {
      nsp.on('connection', (socket: AppSocket) => {
        console.log(
          `[Server +][${name}] Client connected ${socket.id} (${nsp.sockets.size})`
        );
        this.handlers[name].forEach((handler) => handler(socket));
      });
    });
  }

  registerGateway(handler: ConnectionHandler, namespace: string): void {
    if (!this.handlers[namespace]) {
      this.handlers[namespace] = [];
    }
    this.handlers[namespace].push(handler);
  }
}
