const UnoGame = require('./model/src/model/game');
const LobbyManager = require('./services/lobbyManager');
const GameManager = require('./services/gameManager');
const PlayerManager = require('./services/playerManager');

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.lobbyManager = new LobbyManager(io);
    this.gameManager = new GameManager(io);
    this.playerManager = new PlayerManager(io);
    this.games = new Map();

    io.on('connection', (socket) => {
      console.log(`Player connected: ${socket.id}`);

      this.playerManager.handleConnection(socket);

      // Handle login
      socket.on('login', (data) => {
        const { token } = data;
        this.playerManager.playerLogin(socket, token);
      });

      // Delegate lobby events
      socket.on('createLobby', (data) => this.lobbyManager.createLobby(socket, data));
      socket.on('joinLobby', (data) => this.lobbyManager.joinLobby(socket, data));

      socket.on('getLobbies', () => {
        const lobbies = this.lobbyManager.getLobbies();
        socket.emit('lobbiesList', lobbies);
      });

      //WORK IN PROGRESS
      // Delegate game events
      socket.on('playCard', (data) => this.gameManager.playCard(socket, data));// Start a game (single-player or multiplayer)
      socket.on('startGame', ({ isSinglePlayer, numBots }) => {
        try {
          if (isSinglePlayer) {
            const players = [`Player ${socket.id}`, ...Array.from({ length: numBots }, (_, i) => `Bot ${i + 1}`)];
            const game = new UnoGame(players);

            this.games.set(socket.id, game);

            // Emit initial game state to the player
            socket.emit('gameStateUpdate', game.getCurrentState());
            console.log(`Single-player game started by ${socket.id}`);
          } else {
            socket.emit('error', { message: 'Multiplayer functionality is not yet implemented.' });
          }
        } catch (error) {
          socket.emit('error', { message: `Failed to start game: ${error.message}` });
        }
      });

      // Handle player actions
      socket.on('playerAction', ({ type, cardIndex }) => {
        try {
          const game = this.games.get(socket.id);
          if (!game) {
            return socket.emit('error', { message: 'Game not found' });
          }

          if (type === 'DRAW') {
            game.drawCard(game.hand.currentPlayerIndex);
          } else if (type === 'PLAY') {
            game.playCard(game.hand.currentPlayerIndex, cardIndex);
          }

          // Broadcast updated game state to the player
          socket.emit('gameStateUpdate', game.getCurrentState());
        } catch (error) {
          socket.emit('error', { message: `Action failed: ${error.message}` });
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        if (this.games.has(socket.id)) {
          this.games.delete(socket.id);
          console.log(`Game deleted for disconnected player: ${socket.id}`);
        }
        console.log(`Player disconnected: ${socket.id}`);
      });
    });
  }
}

module.exports = SocketHandler;
