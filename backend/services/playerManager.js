// services/PlayerManager.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'MostSecretKeyEver';

class PlayerManager {
  constructor(io) {
    this.io = io;
    this.players = {};
  }

  handleConnection(socket) {
    // On connection, store the player's socket ID but leave other details blank until login
    this.players[socket.id] = { id: socket.id, isLoggedIn: false, username: null };
    socket.emit('connected', { message: 'Player connected', playerId: socket.id });
    console.log(`Player connected with ID: ${socket.id}`);
  }

  async playerLogin(socket, token) {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, SECRET_KEY);

      // Update player data on successful login
      this.players[socket.id] = {
        id: socket.id,
        userId: decoded.id, // User ID from database
        username: decoded.username,
        isLoggedIn: true,
      };

      // Emit login success event to the client
      socket.emit('loginSuccess', {
        message: 'Login successful',
        player: this.players[socket.id],
      });
      console.log(`Player ${socket.id} logged in as ${decoded.username}`);
    } catch (error) {
      socket.emit('loginError', { message: 'Invalid token' });
      console.error('Login failed for socket:', socket.id, error);
    }
  }

  handleDisconnect(socket) {
    delete this.players[socket.id];
    console.log(`Player disconnected with ID: ${socket.id}`);
  }
}

module.exports = PlayerManager;
