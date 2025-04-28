import { CircleCoordinates, CirclePositionDto } from '../schemas/circle.schema';
import { GroupDto, NamespaceGroup } from '../schemas/group.schema';
import { MessageDto } from '../schemas/message.schema';
import { User, UserDto } from '../schemas/user.schema';

export interface ServerToClientEvents {
  user_availability: (data: {
    available: boolean;
    user: UserDto | null;
  }) => void;
  message_new: (message: MessageDto) => void;
  group_conversation: (messages: MessageDto[]) => void;
  group_updated: (groups: GroupDto[]) => void;
  error: (message: string) => void;
  session_expired: () => void;
  circle_move: (position: CirclePositionDto) => void;
  circle_move_islock: (isLock: boolean) => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents;

export interface ClientToServerEvents {
  user_register: (username: string) => void;
  user_logout: () => void;
  message_send: (content: string) => void;
  group_join: (groupId: string) => void;
  group_leave: () => void;
  group_get: () => void;
  circle_position: (position: CircleCoordinates) => void;
  circle_get_position: () => void;
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents;

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user?: User | null;
  namespace?: NamespaceGroup;
  room?: string | null;
}
