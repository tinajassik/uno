// Types used in the game play
export interface GameLobby {
    roomName: string;
    players: string[];
    maxPlayers: number;
    id: string;
}

export interface Action {
    type: "DRAW" | "PLAY" | "SKIP";
    player: string; // Username of the player performing the action
    card?: string; // Card to be played (only needed for "PLAY" action)
}

type Card = { color: string; type: string };

type Player = {
    name: string;
    cards: Card[];
};

type GameState = {
    players: Player[];
    discardPile: Card[];
    drawPile: Card[];
    currentPlayerIndex: number;
};
