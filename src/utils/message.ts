export interface Group {
  id: number;
  name: string;
  icon: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
}

interface AddMessageProps {
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp?: number;
}

// Repositorio principal: map de roomId → array de mensajes
const rooms = new Map<string, Message[]>();

/** Genera un ID único para cada mensaje */
const generateMessageId = (): string =>
  `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

/**
 * Obtiene el array de mensajes para la sala, creándolo si no existe.
 * @param roomId Identificador de la sala
 */
function ensureRoom(roomId: string): Message[] {
  let messages = rooms.get(roomId);
  if (!messages) {
    messages = [];
    rooms.set(roomId, messages);
  }
  return messages;
}

/**
 * Añade un mensaje a la sala indicada.
 * @returns El objeto Message recién creado.
 */
export function addMessage({
  roomId,
  userId,
  username,
  content,
  timestamp = Date.now(),
}: AddMessageProps): Message {
  const message: Message = {
    id: generateMessageId(),
    userId,
    username,
    content,
    timestamp,
  };

  const messages = ensureRoom(roomId);
  messages.push(message);
  return message;
}

/**
 * Busca un mensaje por su ID dentro de la sala indicada.
 * @returns El Message si se encontró, o undefined.
 */
export function getMessageById(
  roomId: string,
  messageId: string
): Message | undefined {
  const messages = rooms.get(roomId);
  return messages?.find((m) => m.id === messageId);
}

/**
 * Devuelve todos los mensajes de una sala (copia del array).
 * @returns Array vacío si la sala no existe.
 */
export function getMessagesByRoom(roomId: string): Message[] {
  const messages = rooms.get(roomId);
  return messages ? [...messages] : [];
}

/**
 * (Opcional) Elimina un mensaje por ID de la sala indicada.
 * @returns true si el mensaje existía y se eliminó.
 */
export function removeMessage(roomId: string, messageId: string): boolean {
  const messages = rooms.get(roomId);
  if (!messages) return false;
  const index = messages.findIndex((m) => m.id === messageId);
  if (index === -1) return false;
  messages.splice(index, 1);
  return true;
}

/**
 * (Opcional) Elimina todos los mensajes de una sala.
 */
export function clearRoom(roomId: string): void {
  rooms.delete(roomId);
}

/**
 * (Opcional) Lista todas las salas con sus mensajes.
 * @returns Un objeto con roomId como clave y array de mensajes como valor.
 */
export function getAllRooms(): Record<string, Message[]> {
  const result: Record<string, Message[]> = {};
  for (const [roomId, messages] of rooms.entries()) {
    result[roomId] = [...messages];
  }
  return result;
}
