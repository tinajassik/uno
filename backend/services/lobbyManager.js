// LobbyManager.js
class LobbyManager {
    constructor(io) {
      this.io = io;
      this.lobbies = {};
    }
  
    createLobby(socket, data) {
        const lobbyId = `lobby-${Math.random().toString(36).substring(7)}`;
      
        // Store the lobby with host information
        this.lobbies[lobbyId] = {
          host: socket.id,
          players: [socket.id]
        };
      
        socket.join(lobbyId);
        socket.emit('lobbyCreated', { lobbyId, hostId: socket.id });
        console.log(`Lobby ${lobbyId} created by ${socket.id}`);
      }
  
    joinLobby(socket, { lobbyId }) {
      if (this.lobbies[lobbyId]) {
        this.lobbies[lobbyId].push(socket.id);
        socket.join(lobbyId);
        this.io.to(lobbyId).emit('playerJoined', { playerId: socket.id });
        console.log(`Player ${socket.id} joined lobby ${lobbyId}`);
      } else {
        socket.emit('error', { message: 'Lobby not found' });
      }
    }
  
    //WORK IN PROGRESS - need to properly handle disconnects
    handleDisconnect(socket) {
      for (const [lobbyId, players] of Object.entries(this.lobbies)) {
        const index = players.indexOf(socket.id);
        if (index !== -1) {
          players.splice(index, 1);
          if (players.length === 0) delete this.lobbies[lobbyId];
          this.io.to(lobbyId).emit('playerLeft', { playerId: socket.id });
          console.log(`Player ${socket.id} left lobby ${lobbyId}`);
          break;
        }
      }
    }

    getLobbies() {
        return Object.keys(this.lobbies).map(lobbyId => ({
          lobbyId,
          hostId: this.lobbies[lobbyId].host,
          playerCount: this.lobbies[lobbyId].players.length,
        }));
      }
  }
  
  module.exports = LobbyManager;
  