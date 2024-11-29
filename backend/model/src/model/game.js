const { UnoDeck } = require('./deck');
const UnoHand = require('./hand');

class UnoGame {
    constructor(players, cardsPerPlayer = 7) {
        const deck = new UnoDeck();
        deck.shuffle();
        this.hand = new UnoHand(players, cardsPerPlayer, deck);
    }

    getCurrentState() {
        return {
            players: this.hand.players,
            discardPile: this.hand.discardPile,
            drawPileSize: this.hand.drawPile.size(),
            currentPlayer: this.hand.currentPlayerIndex,
        };
    }

    playCard(playerIndex, cardIndex) {
        this.hand.playCard(playerIndex, cardIndex);
    }

    drawCard(playerIndex) {
        this.hand.drawCard(playerIndex);
    }
}

module.exports = UnoGame;
