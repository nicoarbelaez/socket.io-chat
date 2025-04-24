import { GroupCache } from '../cache/group.cache';
import { MessageCache } from '../cache/message.cache';
import { Group, GroupDto, NamespaceGroup } from '../schemas/group.schema';
import { MessageDto } from '../schemas/message.schema';
import { generateId } from '../utils/utils';

export class GroupService {
  constructor(
    private cache: GroupCache,
    private cacheMessage: MessageCache
  ) {}

  createGroup(data: Omit<Group, 'id'>): GroupDto {
    const newGroup: Group = {
      ...data,
      id: generateId('G'),
    };

    this.cache.add(newGroup);
    return newGroup;
  }

  getNamespaceGroups(namespace: NamespaceGroup): GroupDto[] {
    return this.cache.getByNamespace(namespace);
  }

  getAllGroups(): Group[] {
    return this.cache.getAll();
  }

  getCoversationByRoomId(roomId: string): MessageDto[] {
    return this.cacheMessage.getByRoom(roomId);
  }
}
