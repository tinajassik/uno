// GameManager.js
// const Game = require('/model/Game');

class GameManager {
  constructor(io) {
    this.io = io;
    this.activeGames = {};
  }

  startGame(socket, { lobbyId }) {
    const lobby = this.lobbies[lobbyId];
  
    if (lobby) {
      if (lobby.host === socket.id) {

        this.io.to(lobbyId).emit('gameStarted', { lobbyId, players: lobby.players });
        //Maybe emit Game object to send state?
        console.log(`Game started by host ${socket.id} in lobby ${lobbyId}`);
      } else {
        socket.emit('error', { message: 'Only the host can start the game.' });
      }
    } else {
      // Lobby not found
      socket.emit('error', { message: 'Lobby not found.' });
    }
  }

  //ADD implementation or call model classes
  playCard(socket, { lobbyId, card }) {
    const game = this.activeGames[lobbyId];
    if (game) {
      const result = game.playCard(socket.id, card);
      if (result.success) {
        this.io.to(lobbyId).emit('cardPlayed', { playerId: socket.id, card });
      } else {
        socket.emit('error', { message: result.message });
      }
    }
  }
}

module.exports = GameManager;
