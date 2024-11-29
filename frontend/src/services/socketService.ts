import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");

// Function to emit the username after connecting
export const emitUsername = (username: string) => {
  socket.emit("registerUser", username);
};

// Other socket event listeners
socket.on("connect", () => {
  console.log("Connected to the server:", socket.id);
});

export default socket;
