import { UserCache } from '../cache/user.cache';
import { User } from '../schemas/user.schema';
import { generateId } from '../utils/utils';

export class UserService {
  constructor(private cache: UserCache) {}

  register(username: string, socketId: string): User {
    const user: User = {
      id: generateId('U'),
      username,
      socketId,
      online: true,
      lastConnection: Date.now(),
    };

    this.cache.add(user);
    return user;
  }

  checkAvailability(username: string): boolean {
    return !this.cache.getByUsername(username);
  }

  removeUser(username: string): boolean {
    return this.cache.remove(username);
  }

  setUserOnlineStatus(username: string, online: boolean): void {
    this.cache.update(username, { online });
  }

  getAllUsers(): User[] {
    return this.cache.getAll();
  }

  getUser(username: string): User | null {
    return this.cache.getByUsername(username) || null;
  }

  getUserBySocketId(socketId: string): User | null {
    return this.cache.getBySocket(socketId) || null;
  }

  isUserOnline(username: string): boolean {
    const isOnline = this.cache.getAttribute(username, 'online');
    return isOnline ?? false;
  }

  getLastConnection(username: string): number | null {
    const lastConnection = this.cache.getAttribute(username, 'lastConnection');
    return lastConnection ? lastConnection : null;
  }
}
