import { v4 as uuidv4 } from 'uuid';
import { Game, Props, createGame } from '../../../shared/model/uno';
import { socketService } from './socketService';
import { Card } from '../../../shared/model/deck';

interface GameSession {
    id: string;
    game?: Game;
    players: string[]; // List of player IDs
    state: 'waiting' | 'in-progress' | 'completed';
    createdAt: Date;
}

export class GameService {
    private static lobbies: Map<string, GameSession> = new Map();

    /**
     * Create a new game lobby (stored in memory)
     */
    static createLobby(creatorId: string): string {
        const lobbyId = uuidv4();
        const newLobby: GameSession = {
            id: lobbyId,
            players: [creatorId],
            state: 'waiting',
            createdAt: new Date(),
        };

        this.lobbies.set(lobbyId, newLobby);

        // Add the creator to the lobby room
        socketService.addUserToRoom(creatorId, lobbyId);

        // Notify the creator about the lobby creation
        socketService.emitToUser(creatorId, 'lobby:created', {
            lobbyId,
            players: [creatorId],
        });

        return lobbyId;
    }

    /**
     * Join an existing lobby
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

        // Add the player to the lobby room
        socketService.addUserToRoom(playerId, lobbyId);

        // Notify all players in the lobby
        socketService.emitToRoom(lobbyId, 'lobby:player-joined', {
            lobbyId,
            playerId,
            players: lobby.players,
        });
    }

    /**
     * Start a game from a lobby
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
        };

        lobby.game = createGame(gameProps);
        lobby.state = 'in-progress';

        // Notify all players in the lobby
        socketService.emitToRoom(lobbyId, 'game:started', {
            lobbyId,
            players: lobby.players,
        });
    }

    /**
     * Start a game with bots
     */
    static startGameWithBots(creatorId: string, botCount: number): string {
        const lobbyId = this.createLobby(creatorId);
        const lobby = this.lobbies.get(lobbyId);

        if (!lobby) {
            throw new Error('Lobby not found');
        }

        // Add bots to the game
        for (let i = 0; i < botCount; i++) {
            lobby.players.push(`Bot${i + 1}`);
        }

        const gameProps: Partial<Props> = {
            players: lobby.players,
            targetScore: 500,
            cardsPerPlayer: 7,
        };

        lobby.game = createGame(gameProps);
        lobby.state = 'in-progress';

        // Notify all players in the lobby
        socketService.emitToRoom(lobbyId, 'game:started-with-bots', {
            lobbyId,
            players: lobby.players,
        });

        socketService.emitToRoom(lobbyId, "game:update", {
            lobbyId,
            game: lobby.game, // Include the current game state
        });

        return lobbyId;
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

        const numericId = parseInt(playerId, 10);
        currentHand.play(numericId, card.color);

        // Notify all players in the lobby about the turn
        socketService.emitToRoom(lobbyId, 'game:turn-played', {
            lobbyId,
            playerId,
            card,
        });

        // Check if the game has a winner
        const winner = lobby.game.getWinner();
        if (winner !== undefined) {
            lobby.state = 'completed';

            socketService.emitToRoom(lobbyId, 'game:ended', {
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
}
