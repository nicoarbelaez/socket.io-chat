import { MessageService } from '../service/message.service';
import { AppSocket, SocketServer } from '../types/socket.types';
import { BaseGateway } from './base.gateway';
import { GatewayManager } from './gateway.manager';

export class MessageGateway extends BaseGateway {
  constructor(
    server: SocketServer,
    gatewayManager: GatewayManager,
    private messageService: MessageService
  ) {
    super(server, gatewayManager);
  }

  protected registerHandlers(): void {
    this.onConnection((socket) => {
      socket.on('message_send', (content) => {
        const room = socket.data.room;
        if (typeof room === 'string') {
          this.sendMessage(socket, content, room);
        }
      });
    });
  }

  private sendMessage(
    socket: AppSocket,
    content: string,
    roomId: string
  ): void {
    const user = socket.data.user;
    if (!user) return;

    const message = this.messageService.createMessage({
      content,
      roomId,
      groupId: 'default',
      userId: user.id,
      timestamp: Date.now(),
      seenBy: [],
    });

    const messageDto = this.messageService.convertMessageToDto(message, user);
    socket.to(roomId).emit('message_new', messageDto);
  }
}
