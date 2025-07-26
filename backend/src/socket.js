// Socket.io setup
import { Server } from 'socket.io';
export default function setupSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('Client connected');
  });
  return io;
}
