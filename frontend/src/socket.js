import { io } from 'socket.io-client';

// Your server URL
const URL = 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false
});