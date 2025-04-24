import { Message } from '../schemas/message.schema';

export class MessageCache {
  private messages = new Map<string, Message[]>();
  private messageIndex = new Map<string, Message>();

  add(roomId: string, message: Message): void {
    const roomMessages = this.messages.get(roomId) || [];
    roomMessages.push(message);
    this.messages.set(roomId, roomMessages);
    this.messageIndex.set(message.id, message);
  }

  getById(roomId: string, messageId: string): Message | undefined {
    const message = this.messageIndex.get(messageId);
    if (!message || message.roomId !== roomId) return undefined;
    return message;
  }

  getByRoom(roomId: string): Message[] {
    return this.messages.get(roomId) || [];
  }

  clearRoom(roomId: string): void {
    const roomMessages = this.messages.get(roomId) || [];
    roomMessages.forEach((message) => this.messageIndex.delete(message.id));
    this.messages.delete(roomId);
  }

  update(messageId: string, updates: Partial<Message>): boolean {
    const message = this.messageIndex.get(messageId);
    if (!message) return false;

    Object.assign(message, updates);

    // Actualizar el mensaje en la lista de la sala
    const roomMessages = this.messages.get(message.roomId);
    if (roomMessages) {
      const index = roomMessages.findIndex((m) => m.id === messageId);
      if (index !== -1) {
        roomMessages[index] = message;
      }
    }

    return true;
  }

  getAllMessages(): Message[] {
    return Array.from(this.messageIndex.values());
  }

  removeMessage(messageId: string): boolean {
    const message = this.messageIndex.get(messageId);
    if (!message) return false;

    // Eliminar de la lista de la sala
    const roomMessages = this.messages.get(message.roomId);
    if (roomMessages) {
      const index = roomMessages.findIndex((m) => m.id === messageId);
      if (index !== -1) {
        roomMessages.splice(index, 1);
      }
    }

    return this.messageIndex.delete(messageId);
  }

  getAttribute<K extends keyof Message>(
    messageId: string,
    attribute: K
  ): Message[K] | null {
    const message = this.messageIndex.get(messageId);
    if (!message) return null;

    return message[attribute];
  }

  getMessageCount(roomId?: string): number {
    if (roomId) {
      return this.getByRoom(roomId).length;
    }
    return this.messageIndex.size;
  }

  getRoomMessagesByDate(
    roomId: string,
    startDate: Date,
    endDate: Date
  ): Message[] {
    const roomMessages = this.getByRoom(roomId);
    return roomMessages.filter((message) => {
      const messageDate = new Date(message.timestamp);
      return messageDate >= startDate && messageDate <= endDate;
    });
  }
}
