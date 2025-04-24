import { GroupDto, NamespaceGroup } from '../schemas/group.schema';
import { MessageDto } from '../schemas/message.schema';
import { UserDto } from '../schemas/user.schema';

export interface ServerToClientEvents {
  user_availability: (data: {
    available: boolean;
    user: UserDto | null;
  }) => void;
  message_new: (message: MessageDto) => void;
  group_conversation: (messages: MessageDto[]) => void;
  group_updated: (groups: GroupDto[]) => void;
  circle_move: (position: { top: string; left: string }) => void;
  error: (message: string) => void;
  session_expired: () => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents;

export interface ClientToServerEvents {
  user_register: (username: string) => void;
  user_logout: () => void;
  message_send: (content: string, roomId: string) => void;
  group_join: (groupId: string) => void;
  group_leave: () => void;
  group_get: () => void;
  circle_position: (position: { top: string; left: string }) => void;
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents;

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  connectedRoom?: string;
  user?: UserDto;
  namespace?: NamespaceGroup;
  group?: string;
}
