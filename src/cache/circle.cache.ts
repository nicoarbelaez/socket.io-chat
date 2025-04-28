import { CirclePosition, CirclePositionUpdate } from '../schemas/circle.schema';

export class CircleCache {
  private position: CirclePosition | undefined;

  updatePosition(position: CirclePositionUpdate): void {
    this.position = position;
  }

  getPosition(): CirclePosition | undefined {
    return this.position;
  }

  removeSocket(): boolean {
    if (this.position?.socketId) {
      this.position.socketId = null;
      return true;
    }
    return false;
  }
}
