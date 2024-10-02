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
  canPlay(arg0: number): boolean;
  discardPile(): Deck;
  playerInTurn(): any;
  playerHand(arg0: number): any;
  play(number: number, color?: string): any;
  draw(): any;
}

export function createHand(players: string[], dealer: number, shuffler: Shuffler<deck.Card>, cardsPerPlayer: number): Hand {
  
  return new UnoHand(players,dealer, shuffler, cardsPerPlayer);
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
  chosenColor: any = undefined;
  cardsPerPlayer: number;
  shuffler: Shuffler<deck.Card>;


  constructor(players: string[], dealer: number, shuffler: Shuffler<deck.Card>, cardsPerPlayer: number) {
    this.shuffler = shuffler;
    
    this.deck = deck.createInitialDeck()
    this.deck.shuffle(shuffler);
    this.cardsPerPlayer = cardsPerPlayer;

    console.log(this.deck.cards)
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
    this.currentPlayerInTurn = this.moveToNextPlayer();

    discard.push(this.deck.deal())
    this.discardP = new deck.UnoDeck(discard);
    this.drawP = this.deck;
    if (this.discardP.top().type === "DRAW") {
      this.players.at(this.currentPlayerInTurn)?.cards.push(this.drawP.deal());
      this.players.at(this.currentPlayerInTurn)?.cards.push(this.drawP.deal());
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
  canPlayAny(): boolean {
    let cards = this.playerHand(this.currentPlayerInTurn);
    for (let index = 0; index < cards.length; index++) {
      if (this.canPlay(index)) return true;
    }
    return false;
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
  canPlay(index: number) : boolean {
    let cardToPlay = this.players.at(this.currentPlayerInTurn)?.cards.slice(index,index+1)[0];
    let discardCard = this.discardP.top();

    if (discardCard.type === "WILD") {
      if (cardToPlay?.type === "WILD DRAW") 
        return !this.playerHand(this.currentPlayerInTurn).some(card => card.color === this.chosenColor)
      return cardToPlay?.color === this.chosenColor || cardToPlay?.type === "WILD";
    }

    if (discardCard.type === "WILD DRAW") {
      return cardToPlay?.color === this.chosenColor;
    }

    switch(cardToPlay?.type) {
      case "NUMBERED":
        return cardToPlay.color === discardCard.color || cardToPlay.number === discardCard.number;
      case "REVERSE":
        return cardToPlay.color === discardCard.color || discardCard.type === "REVERSE";
      case "SKIP":
        return cardToPlay.color === discardCard.color || discardCard.type === "SKIP";
      case "DRAW":
        return cardToPlay.color === discardCard.color || discardCard.type === "DRAW";
      case "WILD":
        return true;
      case "WILD DRAW":
        return !this.playerHand(this.currentPlayerInTurn).some(card => card.color === discardCard.color);


    }
    return false;

  }
  discardPile(): Deck {
    return this.discardP;
  }
  playerInTurn(): number {
   return this.currentPlayerInTurn;
  }
  playerHand(player: number): Card[]{
    return this.players.at(player)!.cards;
  }

  play(index: number, color?: deck.Color) {
    if (index < 0) throw Error("Non-existent card.")
    
    if (!this.canPlay(index)) throw Error("Illegal move");
    let card = this.players.at(this.currentPlayerInTurn)?.cards.splice(index,1)[0];
    

    if (card?.type === "WILD" || card?.type === "WILD DRAW") {
      if (!color) {
        throw Error("Have to choose a color on a wild card");
      }
      this.chosenColor = color;
    } else {
      if (color) throw Error("Can't choose a color.")
    }

    this.discardP.cards.unshift(card!);
    if(card!.type === "SKIP") {
      this.skip = 1;
    }
    if(card!.type === "REVERSE") {
      this.direction = -this.direction;
    }
    
    if (card!.type === "DRAW") {
      let playerToDrawCards = this.moveToNextPlayer();
      this.players.at(playerToDrawCards)?.cards.push(this.drawP.deal());
      this.players.at(playerToDrawCards)?.cards.push(this.drawP.deal());
    }

    if (card!.type === "WILD DRAW") {
      let playerToDrawCards = this.moveToNextPlayer();
      this.players.at(playerToDrawCards)?.cards.push(this.drawP.deal());
      this.players.at(playerToDrawCards)?.cards.push(this.drawP.deal());
      this.players.at(playerToDrawCards)?.cards.push(this.drawP.deal());
      this.players.at(playerToDrawCards)?.cards.push(this.drawP.deal());
    }

    this.currentPlayerInTurn = this.moveToNextPlayer();
    return card;
  }

  draw() {
    let drawCard = this.drawP.deal()
    console.log(drawCard)
    if(!drawCard) {
      console.log("here")
      this.drawP = this.discardP;
      this.drawP.shuffle(this.shuffler);
      let discard: Card[] = [];
      discard.push(this.drawP.deal());
      this.discardP = new deck.UnoDeck(discard);
    }
    let len = this.players.at(this.currentPlayerInTurn)?.cards.push(drawCard);
    len = len! -1;

    if(!(this.canPlay(len))) {
      this.currentPlayerInTurn = this.moveToNextPlayer();
    } 
  }

  private getCards(): Card[] {
    let playerHand: Card[] = [];

    for (let index = 0; index < this.cardsPerPlayer; index++) {
      playerHand.push(this.deck.deal())
      
    }
    return playerHand;

  }

  private moveToNextPlayer(): number {
    this.currentPlayerInTurn += this.direction + this.skip;
    this.skip = 0;
    return ((this.currentPlayerInTurn % this.playerCount) + this.playerCount) % this.playerCount;
  }
  
} 
