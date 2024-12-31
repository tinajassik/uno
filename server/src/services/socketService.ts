import { Server as SocketIOServer, Socket } from "socket.io";

interface UserSocketMap {
  [userId: string]: string; // Maps userId to socket ID
}

class SocketService {
  private io: SocketIOServer | null = null;
  private userSocketMap: UserSocketMap = {};

  initialize(io: SocketIOServer) {
    this.io = io;

    this.io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.auth?.userId;

      if (!userId) {
        console.warn("No userId provided during socket handshake.");
        socket.disconnect();
        return;
      }

      // Map userId to socket ID
      this.userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected with socket ID ${socket.id}`);

      // Handle socket disconnection
      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected.`);
        delete this.userSocketMap[userId];
      });
    });
  }

  // Emit to a specific user
  emitToUser(userId: string, eventType: string, data: any) {
    const socketId = this.userSocketMap[userId];
    if (socketId && this.io) {
      this.io.to(socketId).emit(eventType, data);
    } else {
      console.warn(`Socket not found for userId: ${userId}`);
    }
  }

  // Emit to all users in a room (e.g., lobby or game)
  emitToRoom(roomId: string, eventType: string, data: any) {
    if (this.io) {
      this.io.to(`room:${roomId}`).emit(eventType, data);
    }
  }

  // Add a user to a room
  addUserToRoom(userId: string, roomId: string) {
    const socketId = this.userSocketMap[userId];
    if (socketId && this.io) {
      const socket = this.io.sockets.sockets.get(socketId);
      socket?.join(`room:${roomId}`);
      console.log(`User ${userId} joined room ${roomId}`);
    }
  }

  // Remove a user from a room
  removeUserFromRoom(userId: string, roomId: string) {
    const socketId = this.userSocketMap[userId];
    if (socketId && this.io) {
      const socket = this.io.sockets.sockets.get(socketId);
      socket?.leave(`room:${roomId}`);
      console.log(`User ${userId} left room ${roomId}`);
    }
  }
}

export const socketService = new SocketService();
