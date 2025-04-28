import { User } from '../schemas/user.schema';
import { UserService } from '../service/user.service';
import { AppSocket, SocketServer } from '../types/socket.types';
import { BaseGateway } from './base.gateway';
import { GatewayManager } from './gateway.manager';

export class UserGateway extends BaseGateway {
  constructor(
    server: SocketServer,
    gatewayManager: GatewayManager,
    private readonly userService: UserService
  ) {
    super(server, gatewayManager);
  }

  protected registerHandlers(): void {
    this.onConnection((socket) => {
      const username = socket.handshake.auth.username as string;

      if (!username) {
        socket.emit('session_expired');
      } else {
        this.authenticateUser(username, socket);
      }

      socket.on('user_register', (username) =>
        this.authenticateUser(username, socket)
      );
      socket.on('user_logout', () =>
        this.handleUserDisconnection(socket, 'Client')
      );
      socket.on('disconnect', () =>
        this.handleUserDisconnection(socket, 'Server')
      );
    });
  }

  private authenticateUser(username: string, socket: AppSocket): void {
    const isOnline = this.userService.isUserOnline(username);
    let user: User | null = null;

    if (!isOnline) {
      const userExists = this.userService.getUserByUsername(username);

      if (userExists) {
        this.userService.setUserSocketId(username, socket.id);
        user = userExists;
      } else {
        user = this.userService.register(username, socket.id);
      }
    }

    if (user) {
      socket.data.user = user;
    } else {
      socket.data.user = null;
    }

    socket.emit('user_availability', {
      available: !isOnline,
      user,
    });
  }

  private handleUserDisconnection(
    socket: AppSocket,
    source: 'Client' | 'Server'
  ): void {
    const user = this.userService.getUserBySocketId(socket.id);
    if (!user) return;

    this.userService.setUserOnlineStatus(user.username, false);

    socket.data.user = null;
    socket.data.room = null;

    console.log(
      `[${source} -] Client disconnected ${socket.id} (${this.server.io.engine.clientsCount})`
    );
  }
}
