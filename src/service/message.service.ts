import { MessageCache } from '../cache/message.cache';
import { Message, MessageDto } from '../schemas/message.schema';
import { User } from '../schemas/user.schema';
import { generateId } from '../utils/utils';

export class MessageService {
  constructor(private cache: MessageCache) {}

  createMessage(message: Omit<Message, 'id'>): Message {
    const newMessage: Message = {
      ...message,
      id: generateId('M'),
      timestamp: Date.now(),
    };

    this.cache.add(message.roomId, newMessage);
    return newMessage;
  }

  getRoomHistory(roomId: string): Message[] {
    return this.cache.getByRoom(roomId);
  }

  getMessage(roomId: string, messageId: string): Message | undefined {
    return this.cache.getById(roomId, messageId);
  }

  updateMessage(messageId: string, updates: Partial<Message>): boolean {
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };
    return this.cache.update(messageId, updatedData);
  }

  deleteMessage(messageId: string): boolean {
    return this.cache.removeMessage(messageId);
  }

  getAllMessages(): Message[] {
    return this.cache.getAllMessages();
  }

  getMessagesByDateRange(
    roomId: string,
    startDate: Date,
    endDate: Date
  ): Message[] {
    return this.cache.getRoomMessagesByDate(roomId, startDate, endDate);
  }

  clearRoomHistory(roomId: string): void {
    this.cache.clearRoom(roomId);
  }

  getMessageAttribute<K extends keyof Message>(
    messageId: string,
    attribute: K
  ): Message[K] | null {
    return this.cache.getAttribute(messageId, attribute);
  }

  getMessageCount(roomId?: string): number {
    return this.cache.getMessageCount(roomId);
  }

  convertMessageToDto(message: Message, user: User): MessageDto {
    return {
      ...message,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
