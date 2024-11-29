const COLORS = ['RED', 'GREEN', 'BLUE', 'YELLOW'];

class UnoDeck {
    constructor(cards) {
        this.cards = cards || this.createDeck();
    }

    // Create a full Uno deck
    createDeck() {
        const deck = [];

        // Add colored cards (numbered, skip, reverse, draw)
        for (const color of COLORS) {
            // Add one '0' card per color
            deck.push({ type: 'NUMBERED', color, number: 0 });

            // Add two of each '1-9' card per color
            for (let number = 1; number <= 9; number++) {
                deck.push({ type: 'NUMBERED', color, number });
                deck.push({ type: 'NUMBERED', color, number });
            }

            // Add two of each special action card (skip, reverse, draw)
            deck.push({ type: 'SKIP', color });
            deck.push({ type: 'SKIP', color });
            deck.push({ type: 'REVERSE', color });
            deck.push({ type: 'REVERSE', color });
            deck.push({ type: 'DRAW', color });
            deck.push({ type: 'DRAW', color });
        }

        // Add wild cards (4 of each)
        for (let i = 0; i < 4; i++) {
            deck.push({ type: 'WILD' });
            deck.push({ type: 'WILD DRAW' });
        }

        return deck;
    }

    // Shuffle the deck using the Fisher-Yates algorithm
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // Deal a card from the top of the deck
    deal() {
        return this.cards.shift();
    }

    // Get the size of the deck
    size() {
        return this.cards.length;
    }
}

module.exports = { UnoDeck, COLORS };
