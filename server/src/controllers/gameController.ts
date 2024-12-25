import { Request, Response } from "express";

export const gameController = {
    createGame: (req: Request, res: Response) => {
        const { players, targetScore } = req.body;
        console.log(`Creating game with players: ${players}`);
        res.status(201).json({ message: "Game created successfully!", gameId: "dummy-game-id" });
    },

    joinGame: (req: Request, res: Response) => {
        const { id } = req.params;
        const { player } = req.body;
        console.log(`Player ${player} joining game: ${id}`);
        res.status(200).json({ message: "Player added to game successfully!" });
    },

    startGame: (req: Request, res: Response) => {
        const { id } = req.params;
        console.log(`Starting game with ID: ${id}`);
        res.status(200).json({ message: "Game started successfully!" });
    },

    playTurn: (req: Request, res: Response) => {
        const { id } = req.params;
        const { playerIndex, cardIndex, color } = req.body;
        console.log(`Player ${playerIndex} playing card at index ${cardIndex} with color ${color} in game: ${id}`);
        res.status(200).json({ message: "Turn played successfully!" });
    },

    getGameState: (req: Request, res: Response) => {
        const { id } = req.params;
        console.log(`Fetching state for game ID: ${id}`);
        res.status(200).json({
            gameId: id,
            players: ["Alice", "Bob"],
            currentPlayer: "Alice",
            state: "in-progress"
        });
    },

    getGameList: (req: Request, res: Response) => {
        console.log(`Fetching list of games`);
        res.status(200).json({
            games: [
                { id: "game1", players: ["Alice", "Bob"], state: "in-progress" },
                { id: "game2", players: ["Charlie", "David"], state: "completed" }
            ]
        });
    }
};
