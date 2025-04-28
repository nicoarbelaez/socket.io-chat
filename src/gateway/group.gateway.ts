import { NAMESPACE } from '../config/const';
import { GroupService } from '../service/group.service';
import { AppSocket, SocketServer } from '../types/socket.types';
import { BaseGateway } from './base.gateway';
import { GatewayManager } from './gateway.manager';

export class GroupGateway extends BaseGateway {
  constructor(
    server: SocketServer,
    gatewayManager: GatewayManager,
    private readonly groupService: GroupService,
    namespace: NAMESPACE = NAMESPACE.DEFAULT
  ) {
    super(server, gatewayManager, namespace);
  }

  protected registerHandlers(): void {
    this.onConnection((socket) => {
      socket.on('group_get', () => this.sendGroup(socket));
      socket.on('group_join', (roomId) => this.joinGroup(socket, roomId));
      socket.on('group_leave', () => this.leaveGroup(socket));
    });
  }

  private sendGroup(socket: AppSocket): void {
    const groups = this.groupService.getNamespaceGroups('default');
    socket.emit('group_updated', groups);
  }

  private joinGroup(socket: AppSocket, roomId: string): void {
    this.leaveGroup(socket);

    socket.data.room = roomId;
    socket.join(roomId);
    socket.emit(
      'group_conversation',
      this.groupService.getCoversationByRoomId(roomId)
    );
  }

  private leaveGroup(socket: AppSocket): void {
    const roomOld = socket.data.room;
    if (roomOld) {
      socket.leave(roomOld);
      socket.data.room = null;
    }
  }
}
