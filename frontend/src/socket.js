// Frontend socket.io client
import { io } from 'socket.io-client';
// Use environment variable for WebSocket URL, fallback to localhost
const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:5000';
export const socket = io(wsUrl);
