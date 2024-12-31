import { io, Socket } from "socket.io-client";
import { useGameStore } from "@/store/gameStore";

let socket: Socket | null = null;

/**
 * Initialize the socket connection
 * @param userId - The user ID to authenticate with the socket connection
 */
export const initializeSocket = (userId: string): Socket => {
  if (socket) {
    console.warn("Socket is already initialized.");
    return socket;
  }

  const gameStore = useGameStore();

  socket = io("http://localhost:3000", {
    auth: { userId }, // Attach userId during the handshake
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected.");
  });

  // Game-specific socket events
  socket.on("game:update", (data) => {
    console.log("Game state updated", data);
    gameStore.updateGameState(data.game); // Update game state in the store
  });

  socket.on("player-joined", (data) => {
    console.log("Player joined:", data);
    gameStore.updatePlayers(data.players); // Assuming you have an updatePlayers method
  });

  socket.on("game:started-with-bots", (data) => {
    console.log("Game started with bots:", data);
    gameStore.updateGameState(data.game); // Update the initial game state
    gameStore.updatePlayers(data.players);
    console.log("game:started-with-bots: players=" + gameStore.players);
  });

  return socket;
};

/**
 * Get the socket instance
 * @returns The existing socket instance or null if not initialized
 */
export const getSocket = (): Socket | null => {
  if (!socket) {
    console.warn("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected and cleaned up.");
  }
};

/**
 * Add an event listener to the socket
 * @param event - The event name to listen to
 * @param callback - The callback function to execute when the event is received
 */
export const addSocketListener = (event: string, callback: (...args: any[]) => void): void => {
  if (!socket) {
    console.warn("Socket not initialized. Call initializeSocket first.");
    return;
  }

  socket.on(event, callback);
};

/**
 * Remove an event listener from the socket
 * @param event - The event name to stop listening to
 */
export const removeSocketListener = (event: string): void => {
  if (!socket) {
    console.warn("Socket not initialized. Call initializeSocket first.");
    return;
  }

  socket.off(event);
};

export default socket;
