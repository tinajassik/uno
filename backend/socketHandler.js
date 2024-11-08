// socket-handler.js
const LobbyManager = require('./services/LobbyManager');
const GameManager = require('./services/gameManager');
const PlayerManager = require('./services/playerManager');

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.lobbyManager = new LobbyManager(io);
    this.gameManager = new GameManager(io); 
    this.playerManager = new PlayerManager(io);

    io.on('connection', (socket) => {
      console.log(`Player connected: ${socket.id}`);

      this.playerManager.handleConnection(socket);

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
      socket.on('startGame', (data) => this.gameManager.startGame(socket, data));
      socket.on('playCard', (data) => this.gameManager.playCard(socket, data));

      socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        this.lobbyManager.handleDisconnect(socket);
        this.playerManager.handleDisconnect(socket);
      });
    });
  }
}

module.exports = SocketHandler;
