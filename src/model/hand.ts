import { Shuffler } from "../utils/random_utils";
import * as deck from '../../src/model/deck'
import {Card, Deck} from '../../src/model/deck'

export interface Hand {
  dealer: number;
  player(arg0: number): any;
  playerCount: number;
  onEnd(arg0: (e: any) => number): unknown;
  score(): any;
  winner(): any;
  canPlayAny(): any;
  hasEnded(): any;
  sayUno(arg0: number): unknown;
  drawPile(): Deck;
  catchUnoFailure(arg0: { accuser: number; accused: number; }): any;
  canPlay(arg0: number): any;
  discardPile(): Deck;
  playerInTurn(): any;
  playerHand(arg0: number): any;
  play(number: number, color?: string): any;
  draw(): any;
}

export function createHand(players: string[], dealer: number, shuffler: Shuffler<deck.Card>, cardsPerPlayer: number): Hand {
  
  return new UnoHand(players,dealer, shuffler);
}


type Player = {
  index: number, 
  name: string,
  cards: deck.Card[]
}


class UnoHand implements Hand {
  dealer: number;
  playerCount: number;
  deck: Deck;
  // players: string[] = [];
  players: Player[] = [];
  discardP: Deck; 
  drawP: Deck;
  currentPlayerInTurn:number;
  direction: number = 1;
  skip: number = 0;


  constructor(players: string[], dealer: number, shuffler: Shuffler<deck.Card>) {
    this.deck = deck.createInitialDeck()
    this.deck.shuffle(shuffler);
    if (players.length < 2 || players.length>10) {
      throw new Error("Invalid number of players.");
    }
    this.playerCount = players.length;
    // this.players = players;
    this.dealer = dealer;
    this.currentPlayerInTurn = dealer;

    for (let index =0; index < players.length; index++) {
      let player: Player = { index: index,
        name: players.at(index)!, 
        cards: this.getCards()}
      this.players.push(player);
    }

    let discard: Card[] = [];

    while (this.deck.top().type === "WILD" || this.deck.top().type === "WILD DRAW") {
      shuffler(this.deck.cards);
    }
    if(this.deck.top().type === "REVERSE") {
      this.direction = -1;
    }

    if(this.deck.top().type === "SKIP") {
      this.skip = 1;
    }

    discard.push(this.deck.deal())
    this.discardP = new deck.UnoDeck(discard);
    this.drawP = this.deck;
    if (this.discardP.top().type === "DRAW") {
      this.players.at(this.currentPlayerInTurn+1)?.cards.push(this.drawP.deal());
      this.players.at(this.currentPlayerInTurn+1)?.cards.push(this.drawP.deal());
    }

  }

  player(index: number) {
    if(index < 0 || index > this.playerCount - 1) {
      throw new Error("Index out of bound");
    }
    return this.players.at(index)?.name;
  }
  
  onEnd(arg0: (e: any) => number): unknown {
    throw new Error("Method not implemented.");
  }
  score() {
    throw new Error("Method not implemented.");
  }
  winner() {
    throw new Error("Method not implemented.");
  }
  canPlayAny() {
    throw new Error("Method not implemented.");
  }
  hasEnded() {
    throw new Error("Method not implemented.");
  }
  sayUno(arg0: number): unknown {
    throw new Error("Method not implemented.");
  }
  drawPile(): Deck {
    return this.drawP;
  }
  catchUnoFailure(arg0: { accuser: number; accused: number; }) {
    throw new Error("Method not implemented.");
  }
  canPlay(arg0: number) {
    throw new Error("Method not implemented.");
  }
  discardPile(): Deck {
    return this.discardP;
  }
  playerInTurn(): number {
    this.currentPlayerInTurn += this.direction + this.skip;
    return ((this.currentPlayerInTurn % this.playerCount) + this.playerCount) % this.playerCount;
  }
  playerHand(player: number): Card[]{
    return this.players.at(player)!.cards;
  }
  play(number: number, color?: string) {
    throw new Error("Method not implemented.");
  }
  draw() {
    throw new Error("Method not implemented.");
  }

  private getCards(): Card[] {
    let playerHand: Card[] = [];

    for (let index = 0; index < 7; index++) {
      playerHand.push(this.deck.deal())
      
    }
    return playerHand;

  }
  
} 
