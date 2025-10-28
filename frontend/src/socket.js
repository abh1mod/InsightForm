import { io } from 'socket.io-client';
import { API_URL } from './config/api.js';
// Your server URL
const URL = API_URL;

export const socket = io(URL, {
  autoConnect: false
});