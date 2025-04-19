import { Socket } from 'socket.io';
import { addUser, isUserOnline } from './users.js';

export const socketOnline: string[] = [];

export const addSocketOnline = (scoketId: string) => {
  socketOnline.push(scoketId);
};

export const handleAuthentication = (socket: Socket, username: string) => {
  const isOnline = isUserOnline(username);
  if (!isOnline) {
    addUser(username, socket.id);
    socket.emit('username_availability', { available: true, username });
  } else {
    socket.emit('username_availability', {
      available: false,
      username,
      message: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
    });
  }
};
