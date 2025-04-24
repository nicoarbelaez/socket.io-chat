import { MessageService } from '../service/message.service';
import { UserService } from '../service/user.service';
import { AppSocket, SocketServer } from '../types/socket.types';
import { BaseGateway } from './base.gateway';
import { GatewayManager } from './gateway.manager';

export class MessageGateway extends BaseGateway {
  constructor(
    server: SocketServer,
    gatewayManager: GatewayManager,
    private messageService: MessageService,
    private userService: UserService
  ) {
    super(server, gatewayManager);
  }

  protected registerHandlers(): void {
    this.onConnection((socket) => {
      socket.on('message_send', (content, roomId) =>
        this.sendMessage(socket, content, roomId)
      );
    });
  }

  private sendMessage(
    socket: AppSocket,
    content: string,
    roomId: string
  ): void {
    const userSocket = socket.data.user;
    if (!userSocket) return;

    const user = this.userService.getUser(userSocket.username);
    if (!user) return;

    const message = this.messageService.createMessage({
      content,
      roomId,
      groupId: 'default',
      userId: user.id,
      timestamp: Date.now(),
      seenBy: [],
    });

    console.log('Message sent:', message);
    this.server.io.to(roomId).emit('message_new', message);
  }
}
