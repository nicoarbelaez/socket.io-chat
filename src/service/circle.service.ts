import { CircleCache } from '../cache/circle.cache';
import {
  CircleCoordinates,
  CirclePosition,
  CirclePositionDto,
  CirclePositionUpdate,
} from '../schemas/circle.schema';

export class CircleService {
  private lockInfo: { username: string; socketId: string } | null = null;

  constructor(private cache: CircleCache) {}

  updatePosition(
    position: CircleCoordinates,
    username: string,
    socketId: string
  ): CirclePositionDto | null {
    if (!socketId || !username || !position) {
      return null;
    }

    const updatedPosition: CirclePositionUpdate = {
      ...position,
      username,
      socketId,
    };

    this.cache.updatePosition(updatedPosition);
    return this.convertToDto(updatedPosition);
  }

  getLastPosition(): CirclePositionDto | null {
    const position = this.cache.getPosition();
    if (!position) {
      return null;
    }

    const positionDto = this.convertToDto(position);
    return positionDto;
  }

  removeSocketId(): boolean {
    return this.cache.removeSocket();
  }

  convertToDto(position: CirclePosition): CirclePositionDto | null {
    if (!position.username) {
      return null;
    }

    return {
      top: position.top,
      left: position.left,
      username: position.username,
      color: position.color,
    };
  }

  getLock() {
    return this.lockInfo;
  }

  setLock(username: string, socketId: string) {
    this.lockInfo = { username, socketId };
  }

  clearLock() {
    this.lockInfo = null;
  }
}
