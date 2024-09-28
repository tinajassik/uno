export function createInitialDeck() {
    throw new Error('Function not implemented.');
}
export class Card {
    number;
    color;
    type;
    constructor(number, color, type) {
        this.number = number;
        this.color = color;
        this.type = type;
    }
}
export class Color {
    name;
    static RED = new Color('RED');
    static BLUE = new Color('BLUE');
    static GREEN = new Color('GREEN');
    static YELLOW = new Color('YELLOW');
    constructor(name) {
        this.name = name;
    }
    // Add a method to compare colors by their name
    equals(other) {
        return this.name === other.name;
    }
}
export class Type {
    name;
    static NUMBERED = new Type('NUMBERED');
    static SKIP = new Type('SKIP');
    static REVERSE = new Type('REVERSE');
    static DRAW_TWO = new Type('DRAW_TWO');
    constructor(name) {
        this.name = name;
    }
    equals(other) {
        return this.name === other.name;
    }
}
// Implementing the Deck class
export class UnoDeck {
    cards = [];
    constructor() {
        this.cards = this.createDeck(); // Initialize the deck with all cards
    }
    // Method to create the initial deck
    createDeck() {
        const deck = [];
        // Add numbered cards (assuming 0-9 for each color)
        const colors = [Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW];
        for (const color of colors) {
            for (let num = 0; num <= 9; num++) {
                deck.push(new Card(num, color, Type.NUMBERED));
            }
        }
        // Add special cards like SKIP, REVERSE, DRAW_TWO (add 2 of each per color)
        for (const color of colors) {
            deck.push(new Card(-1, color, Type.SKIP));
            deck.push(new Card(-1, color, Type.SKIP));
            deck.push(new Card(-1, color, Type.REVERSE));
            deck.push(new Card(-1, color, Type.REVERSE));
            deck.push(new Card(-1, color, Type.DRAW_TWO));
            deck.push(new Card(-1, color, Type.DRAW_TWO));
        }
        return deck;
    }
    // Shuffle the deck using a Shuffler
    shuffle(shuffler) {
        this.cards = shuffler.shuffle(this.cards);
    }
    // Deal a card from the deck
    deal() {
        return this.cards.pop(); // Removes the top card from the deck (last element)
    }
    // Return the size of the deck
    get size() {
        return this.cards.length;
    }
    // Filter the deck based on a predicate
    filter(pred) {
        return this.cards.filter(pred); // Uses the predicate to filter the cards
    }
}
//# sourceMappingURL=deck.js.map