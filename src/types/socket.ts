import { Group, Message } from '../utils/message';

export interface ServerToClientEvents {
  request_authentication: () => void;
  update_groups: (groups: Group[]) => void;
  username_availability: (data: {
    available: boolean;
    username: string;
    message: string;
  }) => void;
  conversation: (messages: Message[]) => void;
  new_message: (messageData: {
    content: string;
    username: string;
    timestamp: number;
  }) => void;
  circle_move: (position: { top: string; left: string }) => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  logout: () => void;
  get_groups: () => void;
  check_username: (username: string) => void;
  send_message: (content: string, timestamp: number) => void;
  circle_position: (position: { top: string; left: string }) => void;
  connect_room: (room: { groupId: string; groupName: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  connectedRoom: string;
}
