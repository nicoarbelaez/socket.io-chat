import { NAMESPACE } from '../config/const';
import { CircleService } from '../service/circle.service';
import { SocketServer } from '../types/socket.types';
import { BaseGateway } from './base.gateway';
import { GatewayManager } from './gateway.manager';

export class CircleGateway extends BaseGateway {
  private lockTimeout: NodeJS.Timeout | null = null;

  constructor(
    server: SocketServer,
    gatewayManager: GatewayManager,
    private readonly circleService: CircleService,
    namespace: NAMESPACE = NAMESPACE.DEFAULT
  ) {
    super(server, gatewayManager, namespace);
  }

  protected registerHandlers(): void {
    this.onConnection((socket) => {
      socket.on('circle_position', (position) => {
        if (!socket.data.user) return;

        // Verificar si el círculo está bloqueado por otro usuario
        const currentLock = this.circleService.getLock();
        if (currentLock && currentLock.socketId !== socket.id) {
          return; // Ignorar el movimiento si está bloqueado por otro
        }

        // Establecer el bloqueo
        if (!currentLock) {
          this.circleService.setLock(socket.data.user.username, socket.id);
          socket.broadcast.emit('circle_move_islock', true);
        }

        // Limpiar timeout anterior si existe
        if (this.lockTimeout) {
          clearTimeout(this.lockTimeout);
        }

        // Establecer nuevo timeout para desbloquear
        this.lockTimeout = setTimeout(() => {
          this.circleService.clearLock();
          this.server.io.emit('circle_move_islock', false);
        }, 2000);

        const updatedPosition = this.circleService.updatePosition(
          position,
          socket.data.user.username,
          socket.id
        );

        if (updatedPosition) {
          socket.broadcast.emit('circle_move', updatedPosition);
        }
      });

      socket.on('circle_get_position', () => {
        const position = this.circleService.getLastPosition();
        if (position) {
          socket.emit('circle_move', position);
          const isLock = this.circleService.getLock();
          socket.emit('circle_move_islock', isLock ? true : false);
        }
      });
    });
  }
}
