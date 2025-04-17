import { Message } from '../utils/message';

export interface ServerToClientEvents {
  conversation: (messages: Message[]) => void;
  new_message: (messageData: Message) => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  send_message: (message: string, socketId: string, timestamp: number) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
