export interface User {
  username: string;
  socketId: string;
  online: boolean;
  lastConnection: number;
}

// Repositorios internos
const users = new Map<string, User>();
const socketIdToUsername = new Map<string, string>();

/**
 * Añade o reemplaza un usuario, marca como online y actualiza los mapas.
 */
export function addUser(username: string, socketId: string): User {
  const now = Date.now();

  // Si ya existía, eliminamos la entrada anterior
  const existing = users.get(username);
  if (existing) {
    socketIdToUsername.delete(existing.socketId);
  }

  const user: User = { username, socketId, online: true, lastConnection: now };
  users.set(username, user);
  socketIdToUsername.set(socketId, username);
  return user;
}

/**
 * Elimina un usuario por su username y limpia ambos mapas.
 */
export function removeUser(username: string): boolean {
  const user = users.get(username);
  if (!user) return false;
  socketIdToUsername.delete(user.socketId);
  return users.delete(username);
}

/**
 * Comprueba si un username está libre (no existe en 'users').
 */
export function isUsernameAvailable(username: string): boolean {
  return !users.has(username);
}

/**
 * Marca un usuario como online u offline y actualiza su lastConnection.
 */
export function setUserOnlineStatus(
  username: string,
  online: boolean
): boolean {
  const user = users.get(username);
  if (!user) return false;
  user.online = online;
  user.lastConnection = Date.now();
  return true;
}

/**
 * Devuelve true si el usuario existe y está online.
 */
export function isUserOnline(username: string): boolean {
  const user = users.get(username);
  return user ? user.online : false;
}

/**
 * Recupera un usuario por su username, o null si no existe.
 */
export function getUser(username: string): User | null {
  return users.get(username) || null;
}

/**
 * Recupera un usuario por su socketId, o null si no existe.
 */
export function getUserBySocketId(socketId: string): User | null {
  const username = socketIdToUsername.get(socketId);
  return username ? getUser(username) : null;
}

/**
 * Obtiene el timestamp de la última conexión, o null si no existe.
 */
export function getLastConnection(username: string): number | null {
  const user = users.get(username);
  return user ? user.lastConnection : null;
}

/**
 * Devuelve todos los usuarios como array.
 */
export function getAllUsers(): User[] {
  return Array.from(users.values());
}
