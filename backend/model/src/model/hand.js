class UnoHand {
    constructor(players, cardsPerPlayer, deck) {
        this.players = players.map((name, index) => ({
            name,
            cards: Array.from({ length: cardsPerPlayer }, () => deck.deal()),
            declaredUno: false,
        }));
        this.discardPile = [deck.deal()];
        this.drawPile = deck;
        this.currentPlayerIndex = 0;
        this.direction = 1; // Game direction (1 = clockwise, -1 = counter-clockwise)
    }

    playCard(playerIndex, cardIndex) {
        const player = this.players[playerIndex];
        const card = player.cards[cardIndex];
        this.discardPile.push(card);
        player.cards.splice(cardIndex, 1);

        if (card.type === 'REVERSE') this.direction *= -1;
        if (card.type === 'SKIP') this.currentPlayerIndex = this.getNextPlayerIndex();
        // Handle other card effects like 'DRAW' and 'WILD'

        this.currentPlayerIndex = this.getNextPlayerIndex();
    }

    drawCard(playerIndex) {
        const card = this.drawPile.deal();
        this.players[playerIndex].cards.push(card);
    }

    getNextPlayerIndex() {
        return (this.currentPlayerIndex + this.direction + this.players.length) % this.players.length;
    }
}

module.exports = UnoHand;
