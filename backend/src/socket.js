// Socket.io setup
import { Server } from 'socket.io';
let io;
export default function setupSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('Client connected');
  });
  return io;
}
export { io };
