export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

export interface Room {
  roomId: string;
  messages: Message[];
}

export const rooms: Room[] = [];

interface AddMessageProps {
  roomId: string;
  userId: string;
  content: string;
  timestamp?: number;
}

const generateMessageId = (): string =>
  `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

export const addMessage = ({
  roomId,
  userId,
  content,
}: AddMessageProps): Message => {
  const message: Message = {
    id: generateMessageId(),
    userId,
    content,
    timestamp: Date.now(),
  };

  const room = rooms.find((r) => r.roomId === roomId);

  if (room) {
    room.messages.push(message);
  } else {
    rooms.push({ roomId, messages: [message] });
  }

  return message;
};

export const getMessageById = (
  roomId: string,
  messageId: string
): Message | undefined => {
  const room = rooms.find((r) => r.roomId === roomId);
  return room?.messages.find((m) => m.id === messageId);
};

export const getMessagesByRoom = (roomId: string): Message[] => {
  const room = rooms.find((r) => r.roomId === roomId);
  return room ? [...room.messages] : [];
};
