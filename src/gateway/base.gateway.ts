import { NAMESPACE } from '../config/const';
import { SocketServer } from '../types/socket.types';
import { ConnectionHandler, GatewayManager } from './gateway.manager';

export abstract class BaseGateway {
  protected namespace: NAMESPACE;

  constructor(
    protected readonly server: SocketServer,
    protected readonly gatewayManager: GatewayManager,
    namespace = NAMESPACE.DEFAULT
  ) {
    this.namespace = namespace;
    this.registerHandlers();
  }

  protected abstract registerHandlers(): void;

  protected onConnection(handler: ConnectionHandler): void {
    this.gatewayManager.registerGateway(handler, this.namespace);
  }

  protected getNamespace() {
    return this.server.namespaces[this.namespace];
  }
}
