import { defineStore } from 'pinia';
import socket from "../services/socketService";
import type {Game} from "@shared/uno";
import type {Hand} from "@shared/hand";
import type {Card} from "@shared/deck";
import {createGame} from "@shared/uno";

export const useGameStore = defineStore('game', {
    state: () => ({
        game: null as Game | null, // Current game state
        lobbyId: null,
        players: [] as string[],
    }),

    getters: {
        currentGame(state): Game | null {
            return state.game ?? null;
        },
        currentHand(state): Hand | null {
            return state.game?.getCurrentHand() ?? null;
        },
        currentPlayer(state): number | null {
            return state.game?.getCurrentHand()?.playerInTurn() ?? null;
        },
        winner(state): string | null {
            return state.game?.getWinner() !== undefined
                ? state.game?.player(state.game?.getWinner()!)
                : null;
        },
        playerCards(state): Card[] | null {
            const hand: Hand | undefined = state.game?.getCurrentHand();
            if (hand && this.currentPlayer)
            {
                return hand.playerHand(this.currentPlayer)
            }
            return [];
        }
    },

    actions: {
        /**
         * Fetch the initial game state from the backend.
         * @param gameId - ID of the game to fetch.
         */
        // async fetchGameState(gameId: string) {
        //     // this.isLoading = true;
        //     try {
        //         const response = await fetch(`/games/${gameId}`);
        //         const gameData = await response.json();
        //         this.$patch({
        //             game: {
        //                 ...gameData,
        //                 getCurrentHand: () => gameData.currentHand,
        //             },
        //         });
        //     } catch (error) {
        //         console.error('Failed to fetch game state:', error);
        //     } finally {
        //         // this.isLoading = false;
        //     }
        // },

        /**
         * Update the game state locally via WebSocket events.
         * @param updatedGame - Partial game state to patch.
         */
        // updateGameState(updatedGame: Partial<Game>) {
        //     if (this.game) {
        //         this.$patch({ game: { ...this.game, ...updatedGame } });
        //     } else {
        //         this.$patch({ game: createGame(updatedGame as any)});
        //     }
        //     console.log("New game state:", this.game); // Log the new state
        // },

        updateGameState(updatedGameData: any) {
            if (!updatedGameData) return;

            console.log("UpdatedGameData: players=" + updatedGameData.players)

            if (!this.game) {
                // Rebuild the `Game` object
                const rebuiltGame = createGame({
                    players: updatedGameData.players || [], // Ensure players array is passed
                    targetScore: updatedGameData.targetScore || 500, // Default if not provided
                    cardsPerPlayer: updatedGameData.cardsPerPlayer || 7, // Default if not provided
                    // randomizer: () => Math.floor(Math.random() * updatedGameData.players.length), // Randomizer function
                    shuffler: updatedGameData.shuffler, // Pass shuffler if present
                });
                this.$patch({ game: rebuiltGame });
            }
            else
            {
                this.$patch( {game: updatedGameData});
            }
        },


        updatePlayers(players: string[]) {
            this.players = players;
        },

        /**
         * Play a turn in the game.
         * @param cardIndex - Index of the card to play.
         * @param color - Optional color for wild cards.
         */
        async playTurn(cardIndex: number, color?: string) {
            if (!this.game) return;
            const currentPlayerIndex = this.game?.getCurrentHand()?.playerInTurn();
            // try {
            //     const response = await fetch(`/games/${this.game.id}/play`, {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ playerIndex: currentPlayerIndex, cardIndex, color }),
            //     });
            //     if (response.ok) {
            //         const updatedGame = await response.json();
            //         this.updateGameState(updatedGame);
            //     } else {
            //         const error = await response.json();
            //         console.error('Failed to play turn:', error.message);
            //     }
            // } catch (error) {
            //     console.error('Error playing turn:', error);
            // }
        },
    },
});
