'use client';

import { io, type Socket } from 'socket.io-client';
import { env } from './env';
import { getToken } from './auth-token';

let socket: Socket | null = null;

// Singleton Socket.io client — used for live split-billing status,
// notifications, and messaging (mirrors backend src/config/socket.ts).
export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
      auth: (cb) => cb({ token: getToken() }),
    });
  }
  return socket;
}

export function connectSocket(): Socket {
  const s = getSocket();
  const token = getToken();
  if (token && !s.connected) {
    s.auth = { token };
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}
