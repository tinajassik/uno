import * as readline from 'readline';
import { createGame, Props } from './model/uno';
import { Card, createInitialDeck, Deck} from './model/deck';
import { Game } from './model/uno';
import { Shuffler, standardShuffler } from './utils/random_utils';
import { createHand } from './model/hand';
import { Hand } from './model/hand';

class letsplay {
    private rl: readline.Interface;
    private numberOfPlayers: number;
    private game: Game | null = null;
    private players: string [] = [];
    private hand: Hand | null = null;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.numberOfPlayers = 0;
    }

    public askForNoPlayers():void {
        this.rl.question("How many players will be in the game?", input => {
            const players = parseInt(input);
            if(!isNaN(players) && players >= 2 && players < 5){
                this.numberOfPlayers = players;
                console.log(`Number of players: ${this.numberOfPlayers}`);
                this.askForPlayerNames();
            }else{
                console.log('Please enter a valid number of players');
                this.askForNoPlayers();
            }
        })
    }

    public askForPlayerNames(): void {
        const askName = (index: number): void => {
            if (index < this.numberOfPlayers) {
                this.rl.question(`Enter player name ${index + 1}: `, (name) => {
                    this.players.push(name);
                    askName(index + 1);
                });
            } else {
                this.startGame(); // Start the game after player names are collected
            }
        };
        askName(0);
    }

    public startGame(): void {
        const props: Partial<Props> ={
            players: this.players,
            targetScore: 500,
            randomizer: () => Math.floor(Math.random()) * this.players.length,
            cardsPerPlayer: 7
        };
        this.game = createGame(props);

        console.log("Game initialized with players: ", this.players.toString());
        
        this.displayPlayerHands(); // Display each player's initial hand
        this.printDiscardPile();   // Print the initial discard pile card
        this.takeTurn(); //Start the first turn
    }

    private displayPlayerHands(): void {
        if (!this.game) {
            console.log("Game not initialized.");
            return;
        }

        const currentHand = this.game.getCurrentHand();
        if (!currentHand) {
            console.log("Hand not initialized.");
            return;
        }

        this.players.forEach((player, index) => {
            const handCards = currentHand.playerHand(index);
            console.log(`Player ${player}'s hand:`);
            handCards.forEach((card: Card) => {
                console.log(`${card.color || ''} ${card.type} ${card.number !== undefined ? card.number : ''}`);
            });
            console.log('\n');
        });
    }

    private printDiscardPile(): void {
        if (!this.game) {
            console.log("Game not initialized.");
            return;
        }

        const currentHand = this.game.getCurrentHand();
        if (!currentHand) {
            console.log("Hand not initialized.");
            return;
        }

        const discardPile = currentHand.discardPile();
        const topCard = discardPile.top();

        console.log("Initial discard pile card:");
        console.log(`${topCard.color || ''} ${topCard.type} ${topCard.number !== undefined ? topCard.number : ''}`);
    }

    private takeTurn(): void {
        if (!this.game) {
            console.log("Game not initialized.");
            return;
        }

        const currentHand = this.game.getCurrentHand();
        if (!currentHand) {
            console.log("Hand not initialized.");
            return;
        }

        const currentPlayerIndex = currentHand.playerInTurn();
        if (currentPlayerIndex === undefined) {
            console.log("Game has ended or an error occurred.");
            return;
        }

        const currentPlayer = this.players[currentPlayerIndex];
        console.log(`It's ${currentPlayer}'s turn!`);

        // Display the current player's hand
        const handCards = currentHand.playerHand(currentPlayerIndex) as Card[];
        console.log(`Your hand:`);
        handCards.forEach((card: Card, index) => {
            console.log(`${index + 1}: ${card.color || ''} ${card.type} ${card.number !== undefined ? card.number : ''}`);
        });

        // Prompt the player to choose an action
        this.rl.question("Choose an action: (play [card number] or draw): ", (action) => {
            const [command, value] = action.split(" ");

            if (command === "play" && value) {
                const cardIndex = parseInt(value) - 1;
                if (!isNaN(cardIndex) && cardIndex >= 0 && cardIndex < handCards.length) {
                    try {
                        const cardToPlay = handCards[cardIndex];
                        const chosenColor = cardToPlay.type === "WILD" || cardToPlay.type === "WILD DRAW" ? "RED" : undefined; // For simplicity, you can let them choose a color here if needed
                        currentHand.play(cardIndex, chosenColor);
                        console.log(`${currentPlayer} played: ${cardToPlay.color || ''} ${cardToPlay.type} ${cardToPlay.number !== undefined ? cardToPlay.number : ''}`);
                    
                        this.printCurrentDiscard();
                    } catch (error) {
                        if(error instanceof Error)
                        console.log("Invalid move:", error.message);
                        else
                        console.log("An unknown error occurred.");
                    }
                } else {
                    console.log("Invalid card number.");
                }
            } else if (command === "draw") {
                currentHand.draw();
                console.log(`${currentPlayer} drew a card.`);

                this.printCurrentDiscard();
            } else {
                console.log("Invalid action. Please enter 'play [card number]' or 'draw'.");
            }

            if (!currentHand.hasEnded()) {
                this.takeTurn(); // Continue to the next turn
            } else {
                console.log("The game has ended!");
                this.rl.close();
            }
        });
    }

    private printCurrentDiscard(): void {
        if (!this.game) {
            console.log("Game not initialized.");
            return;
        }
    
        const currentHand = this.game.getCurrentHand();
        if (!currentHand) {
            console.log("Hand not initialized.");
            return;
        }
    
        const topCard = currentHand.discardPile().top();
        console.log("Current discard pile card:");
        console.log(`${topCard.color || ''} ${topCard.type} ${topCard.number !== undefined ? topCard.number : ''}`);
    }
}

const game = new letsplay();
game.askForNoPlayers()



