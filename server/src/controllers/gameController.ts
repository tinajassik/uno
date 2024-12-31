import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

export const gameController = {
    createGame: (req: Request, res: Response) => {
        try {
            const { userId, targetScore } = req.body;
            const gameId = GameService.createLobby(userId);
            res.json({ gameId });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    },

    joinGame: (req: Request, res: Response) => {
        try {
            const { id: gameId } = req.params;
            const { userId } = req.body;
            GameService.joinLobby(gameId, userId);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    },

    startGame: (req: Request, res: Response) => {
        try {
            const { id: gameId } = req.params;
            GameService.startGame(gameId);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    },

    playTurn: (req: Request, res: Response) => {
        try {
            const { id: gameId } = req.params;
            const { userId, card } = req.body;
            GameService.playTurn(gameId, userId, card);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    },

    getGameState: (req: Request, res: Response) => {
        try {
            const { id: gameId } = req.params as { id: string };
            const game = GameService.getLobbyState(gameId);
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            res.json(game);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    },

    getGameList: (req: Request, res: Response) => {
        try {
            const games = GameService.getLobbyList();
            res.json(games);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    },

    playWithBots: (req: Request, res: Response) => {
        try {
            const { userId, botCount } = req.body;
            const lobbyId = GameService.startGameWithBots(userId, botCount);
            res.status(200).json({ lobbyId });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
};