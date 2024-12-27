import { v4 as uuidv4 } from 'uuid';
import { Game, Props, createGame } from '../../../shared/model/uno';
import { Server as SocketIOServer } from 'socket.io';
import { Hand } from '../../../shared/model/hand';
import { Card } from '../../../shared/model/deck';

interface GameSession {
    id: string;
    game?: Game;
    players: string[];
    state: 'waiting' | 'in-progress' | 'completed';
    createdAt: Date;
}

export class GameService {
    private static io: SocketIOServer;
    private static lobbies: Map<string, GameSession> = new Map();

    // Initialize the Socket.IO server
    static initialize(io: SocketIOServer): void {
        this.io = io;
        this.setupSocketHandlers();
    }

    // Socket handlers for joining/leaving game rooms
    private static setupSocketHandlers(): void {
        this.io.on('connection', (socket) => {
            socket.on('join-game', (gameId: string, playerId: string) => {
                socket.join(`game:${gameId}`);
            });

            socket.on('leave-game', (gameId: string) => {
                socket.leave(`game:${gameId}`);
            });
        });
    }

    private static emitToGame(gameId: string, eventType: string, data: any): void {
        this.io.to(`game:${gameId}`).emit(eventType, data);
    }

    // === Public API ===

    /**
     * Create a new game lobby (stored in memory)
     */
    static createLobby(creatorId: string): string {
        const lobbyId = uuidv4();

        const newLobby: GameSession = {
            id: lobbyId,
            game: undefined, // Game object is created when the game starts
            players: [creatorId],
            state: 'waiting',
            createdAt: new Date(),
        };

        this.lobbies.set(lobbyId, newLobby);

        this.emitToGame(lobbyId, 'lobby:created', {
            lobbyId,
            players: [creatorId],
        });

        return lobbyId;
    }

    /**
     * Join an existing lobby (stored in memory)
     */
    static joinLobby(lobbyId: string, playerId: string): void {
        const lobby = this.lobbies.get(lobbyId);

        if (!lobby) {
            throw new Error('Lobby not found');
        }

        if (lobby.state !== 'waiting') {
            throw new Error('Lobby is not accepting players');
        }

        if (lobby.players.includes(playerId)) {
            throw new Error('Player already in lobby');
        }

        lobby.players.push(playerId);

        this.emitToGame(lobbyId, 'lobby:player-joined', {
            lobbyId,
            playerId,
        });
    }

    /**
     * Start the game from a lobby
     */
    static startGame(lobbyId: string): void {
        const lobby = this.lobbies.get(lobbyId);

        if (!lobby) {
            throw new Error('Lobby not found');
        }

        if (lobby.state !== 'waiting') {
            throw new Error('Game has already started');
        }

        if (lobby.players.length < 2) {
            throw new Error('Not enough players to start the game');
        }

        const gameProps: Partial<Props> = {
            players: lobby.players,
            targetScore: 500,
            cardsPerPlayer: 7,
            // randomizer: () => Math.floor(Math.random() * lobby.players.length),
        };

        lobby.game = createGame(gameProps);
        lobby.state = 'in-progress';

        this.emitToGame(lobbyId, 'game:started', {
            lobbyId,
            players: lobby.players,
        });
    }

    static playWithBots(creatorId: string, botCount: number): string {
        // Create a lobby first
        const lobbyId = uuidv4();
    
        const newLobby: GameSession = {
            id: lobbyId,
            players: [creatorId],
            state: 'waiting',
            createdAt: new Date(),
        };
    
        this.lobbies.set(lobbyId, newLobby);
    
        // Start the game with bots
        this.startGameWithBots(lobbyId, botCount);
    
        return lobbyId; // Return the lobby ID to the frontend for tracking
    }
    

    static startGameWithBots(lobbyId: string, botCount: number): void {
        const lobby = this.lobbies.get(lobbyId);
    
        if (!lobby) {
            throw new Error('Lobby not found');
        }
    
        if (lobby.state !== 'waiting') {
            throw new Error('Game has already started');
        }
    
        if (lobby.players.length + botCount < 2) {
            throw new Error('Not enough players to start the game');
        }
    
        // Add bots to the player list
        for (let i = 0; i < botCount; i++) {
            const botName = `Bot${i + 1}`;
            lobby.players.push(botName);
        }
    
        // Create game instance
        const gameProps: Partial<Props> = {
            players: lobby.players,
            targetScore: 500,
            cardsPerPlayer: 7,
        };
    
        lobby.game = createGame(gameProps);
        lobby.state = 'in-progress';
    
        this.emitToGame(lobbyId, 'game:started-with-bots', {
            lobbyId,
            players: lobby.players,
        });

        this.emitToGame(lobbyId, 'game:update',{
            lobbyId,
            game: lobby.game,
        })
    }
    

    /**
     * Play a turn in the game
     */
    static playTurn(lobbyId: string, playerId: string, card: Card): void {
        const lobby = this.lobbies.get(lobbyId);

        if (!lobby) {
            throw new Error('Lobby not found');
        }

        if (lobby.state !== 'in-progress') {
            throw new Error('Game is not in progress');
        }

        if (!lobby.game) {
            throw new Error('Game instance not found');
        }

        const currentHand = lobby.game.getCurrentHand();
        if (!currentHand) {
            throw new Error('Current hand is not available');
        }
        //Should be index, color?
        currentHand.play(1, card.color);

        // Game-specific logic to play a turn
        // Example:
        // lobby.game.playTurn(playerId, card);

        this.emitToGame(lobbyId, 'game:turn-played', {
            lobbyId,
            playerId,
            card,
        });

        // Check if the game has a winner
        const winner = lobby.game.getWinner();
        if (winner !== undefined) {
            lobby.state = 'completed';

            this.emitToGame(lobbyId, 'game:ended', {
                lobbyId,
                winner: lobby.players[winner],
            });
        }
    }

    /**
     * Get the current state of a game lobby
     */
    static getLobbyState(lobbyId: string): GameSession | null {
        return this.lobbies.get(lobbyId) || null;
    }

    /**
     * Get a list of all lobbies
     */
    static getLobbyList(): GameSession[] {
        return Array.from(this.lobbies.values());
    }

    // === Private Helpers ===

    private static findLobby(lobbyId: string): GameSession {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            throw new Error('Lobby not found');
        }
        return lobby;
    }
}
