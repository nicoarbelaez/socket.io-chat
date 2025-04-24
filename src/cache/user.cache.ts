import { User } from '../schemas/user.schema';

export class UserCache {
  private users = new Map<string, User>();
  private socketMap = new Map<string, string>();

  add(user: User): void {
    this.users.set(user.username, user);
    this.socketMap.set(user.socketId, user.username);
  }

  getByUsername(username: string): User | undefined {
    return this.users.get(username);
  }

  getBySocket(socketId: string): User | undefined {
    const username = this.socketMap.get(socketId);
    return username ? this.users.get(username) : undefined;
  }

  remove(username: string): boolean {
    const user = this.users.get(username);
    if (!user) return false;

    this.socketMap.delete(user.socketId);
    return this.users.delete(username);
  }

  getAll(): User[] {
    return Array.from(this.users.values());
  }

  update(username: string, updates: Partial<User>): boolean {
    const user = this.users.get(username);
    if (!user) return false;

    if (updates.socketId && updates.socketId !== user.socketId) {
      this.socketMap.delete(user.socketId);
      this.socketMap.set(updates.socketId, username);
    }

    Object.assign(user, updates);
    this.users.set(username, user);

    return true;
  }

  getAttribute<K extends keyof User>(
    username: string,
    attribute: K
  ): User[K] | null {
    const user = this.users.get(username);
    if (!user) return null;

    return user[attribute];
  }
}
