import { CardPredicate } from "../../__test__/utils/predicates";
import { Shuffler } from "../utils/random_utils";

export interface Deck {
  top(): Card;
  deal(): any;
  size: number;
  cards: Card[],
  filter(arg0: CardPredicate): any;
  shuffle(shuffler: Shuffler<Card>): void;
}

export function createInitialDeck(): Deck {
  return new UnoDeck();
}
export interface Card {
  type: Type;
  color?: Color; 
  number?: number; 
}

export type Color = 'RED' | 'GREEN' | 'BLUE' | 'YELLOW';

export type Type = 'NUMBERED' | 'SKIP' | 'REVERSE' | 'DRAW' | 'WILD' | 'WILD DRAW';

export const COLORS: Color[] = ['RED', 'GREEN', 'BLUE', 'YELLOW']; 

export class UnoDeck implements Deck {
     cards: Card[] = [];
     
    constructor(cards?: Card[]) {
      this.cards = cards || this.createDeck();
    }
  
  
    createDeck(): Card[] {
      const deck: Card[] = [];

      for (let color of COLORS) {
        deck.push({ type: 'NUMBERED', color, number: 0 }); // One '0' card per color
  
        for (let number = 1; number <= 9; number++) {
          deck.push({ type: 'NUMBERED', color, number });
          deck.push({ type: 'NUMBERED', color, number });
        }
      }

      for (let color of COLORS) {
        deck.push({ type: 'SKIP', color });
        deck.push({ type: 'SKIP', color });
  
        deck.push({ type: 'REVERSE', color });
        deck.push({ type: 'REVERSE', color });
  
        deck.push({ type: 'DRAW', color });
        deck.push({ type: 'DRAW', color });
      }
  
      for (let i = 0; i < 4; i++) {
        deck.push({ type: 'WILD' });
        deck.push({ type: 'WILD DRAW' });
      }
  
      return deck;
    }
  
  
    shuffle(shuffler: Shuffler<Card>): void {
      shuffler(this.cards);
    }
  
    
    deal(): Card | undefined {
      let card = this.cards.shift();
      return card; 
    }
  
    get size(): number {
      return this.cards.length;
    }

    top(): Card {
      return this.cards.at(0)!;
    }
  
    filter(predicate: (card: Card) => boolean): Deck {
      return new UnoDeck(this.cards.filter(predicate));
    }
  }