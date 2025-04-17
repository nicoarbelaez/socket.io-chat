export interface Message {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

export const messages: Message[] = [];

export const addMessage = ({ id, name, message, timestamp }: Message) => {
  messages.push({ id, name, message, timestamp });
};
