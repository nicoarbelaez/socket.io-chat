import { GroupService } from '../service/group.service';
import { AppSocket, SocketServer } from '../types/socket.types';
import { BaseGateway } from './base.gateway';
import { GatewayManager } from './gateway.manager';

export class GroupGateway extends BaseGateway {
  constructor(
    server: SocketServer,
    gatewayManager: GatewayManager,
    private readonly groupService: GroupService
  ) {
    super(server, gatewayManager);
  }

  protected registerHandlers(): void {
    this.onConnection((socket) => {
      socket.on('group_get', () => this.sendGroups(socket));
      socket.on('group_join', (roomId) => this.joinGroups(socket, roomId));
      socket.on('group_leave', () => this.leaveGroups(socket));
    });
  }

  private sendGroups(socket: AppSocket): void {
    const groups = this.groupService.getNamespaceGroups('default');
    socket.emit('group_updated', groups);
  }

  private joinGroups(socket: AppSocket, roomId: string): void {
    this.leaveGroups(socket);

    socket.data.connectedRoom = roomId;
    socket.join(roomId);
    socket.emit(
      'group_conversation',
      this.groupService.getCoversationByRoomId(roomId)
    );
  }

  private leaveGroups(socket: AppSocket): void {
    const roomOld = socket.data.connectedRoom;
    if (roomOld) {
      socket.leave(roomOld);
      socket.data.connectedRoom = undefined;
    }
  }
}
