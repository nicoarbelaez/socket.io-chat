import { SocketServer } from '../types/socket.types';
import { ConnectionHandler, GatewayManager } from './gateway.manager';

export abstract class BaseGateway {
  constructor(
    protected readonly server: SocketServer,
    protected readonly gatewayManager: GatewayManager
  ) {
    this.registerHandlers();
  }

  protected abstract registerHandlers(): void;

  protected onConnection(handler: ConnectionHandler): void {
    this.gatewayManager.registerGateway(handler);
  }
}
