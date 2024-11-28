import { Shuffler } from "../utils/random_utils";
import * as deck from '../../src/model/deck'
import {Card, Deck} from '../../src/model/deck'

export interface Hand {
  
  dealer: number;
  player(arg0: number): any;
  playerCount: number;
  onEnd(arg0: (e: any) => number): unknown;
  score(): number | undefined;
  winner(): number | undefined;
  canPlayAny(): any;
  hasEnded(): boolean;
  sayUno(arg0: number): unknown;
  drawPile(): Deck;
  catchUnoFailure(arg0: { accuser: number; accused: number; }): any;
  canPlay(arg0: number): boolean;
  discardPile(): Deck;
  playerInTurn(): number | undefined;
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
  cards: deck.Card[],
  declaredUno: boolean,
  turnStarted: boolean,
}


class UnoHand implements Hand {
  private endCallbacks: Array<(e: any) => void> = [];
  dealer: number;
  playerCount: number;
  deck: Deck;
  players: Player[] = [];
  discardP: Deck; 
  drawP: Deck;
  currentPlayerInTurn: number;
  direction: number = 1;
  skip: number = 0;
  chosenColor: any = undefined;
  cardsPerPlayer: number;
  shuffler: Shuffler<deck.Card>;
  declaredUnoInCorrectState: boolean = false;
  isEmptyHand: boolean = false;

  constructor(players: string[], dealer: number, shuffler: Shuffler<deck.Card>, cardsPerPlayer: number) {
    this.shuffler = shuffler;
    
    this.deck = deck.createInitialDeck()
    this.deck.shuffle(shuffler);
    this.cardsPerPlayer = cardsPerPlayer;

    if (players.length < 2 || players.length>10) {
      throw new Error("Invalid number of players.");
    }
    this.playerCount = players.length;
    this.dealer = dealer;
    this.currentPlayerInTurn = dealer;

    for (let index =0; index < players.length; index++) {
      let player: Player = { index: index,
        name: players.at(index)!, 
        cards: this.getCards(),
        declaredUno: false,
        turnStarted:false
      }
      this.players.push(player);
    }

    let discard: Card[] = [];

    while (this.deck.top().type === "WILD" || this.deck.top().type === "WILD DRAW") {
      shuffler(this.deck.cards);
    }

    discard.push(this.deck.deal())
    this.discardP = new deck.UnoDeck(discard);
    this.drawP = this.deck;


    if(this.discardP.top().type === "REVERSE") {
      if (this.playerCount === 2) this.skip = 1;
      else this.direction = -1;
    }

    if(this.discardP.top().type === "SKIP") {
      this.skip = 1;
    }
    
    if (this.discardP.top().type === "DRAW") {
      this.players.at(this.currentPlayerInTurn+1)?.cards.push(this.drawP.deal()); // +1 because initially the first player is the dealer
      this.players.at(this.currentPlayerInTurn+1)?.cards.push(this.drawP.deal());
      this.skip = 1;
    }

    this.currentPlayerInTurn = this.moveToNextPlayer();

  }

  player(index: number) {
    if(index < 0 || index > this.playerCount - 1) {
      throw new Error("Index out of bound");
    }
    return this.players.at(index)?.name;
  }
  
  onEnd(callback: (e: any) => number) {
    this.endCallbacks.push(callback);
  }

  score(): number | undefined {
    return this.hasEnded() ? this.calculateScore() : undefined;
  }
  winner(): number | undefined {
    for (let index = 0; index < this.players.length; index++) {
      if (this.players[index].cards.length === 0) return index;
    }
    return undefined;
  }
  canPlayAny(): boolean {
    if (this.hasEnded()) return false;
    let cards = this.playerHand(this.currentPlayerInTurn);
    for (let index = 0; index < cards.length; index++) {
      if (this.canPlay(index)) return true;
    }
    return false;
  }
  hasEnded(): boolean {
    return this.isEmptyHand;
  }
  sayUno(player: number) {
    if (this.hasEnded()) throw Error("Can't draw, round has ended.");
    if (player < 0 || player >= this.playerCount) throw Error ("player out of bounds")
    if (this.currentPlayerInTurn === player
      || this.currentPlayerInTurn === this.getNextPlayer(player)
    ) this.players[player].declaredUno = true;
  }
  drawPile(): Deck {
    return this.drawP;
  }

  catchUnoFailure({ accuser, accused }: { accuser: number, accused: number }): boolean {

    if (accused < 0 || accused >= this.playerCount) throw Error ("accused out of bounds")
    const accusedPlayer = this.players[accused];
    if (this.currentPlayerInTurn != this.getNextPlayer(accused)) return false; // means other played did a move in the meantime
    if (accusedPlayer.cards.length === 1 && !accusedPlayer.declaredUno) {
      for (let index = 0; index < 4; index++) {
        let card = this.drawP.deal();
        if (!card) {
          this.reshuffle();
          card = this.drawP.deal();
        }
        accusedPlayer.cards.push(card);
      }
      return true; 
    }
    return false; 
  }

  canPlay(index: number) : boolean {

    if (this.hasEnded()) return false;

    const currentPlayerHand = this.playerHand(this.currentPlayerInTurn);
    const cardToPlay = currentPlayerHand[index];
    let discardCard = this.discardP.top();

    if (!currentPlayerHand|| index < 0 || index >= currentPlayerHand.length) {
      return false; 
    }

    const isMatchingColor = cardToPlay.color === discardCard.color;
    const isMatchingNumber = cardToPlay.number === discardCard.number;

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
        return isMatchingColor || isMatchingNumber;
      case "REVERSE":
        return isMatchingColor || discardCard.type === "REVERSE";
      case "SKIP":
        return isMatchingColor|| discardCard.type === "SKIP";
      case "DRAW":
        return isMatchingColor || discardCard.type === "DRAW";
      case "WILD":
        return true;
      case "WILD DRAW":
        return !this.playerHand(this.currentPlayerInTurn).some(card => card.color === discardCard.color);
      default:
        return false;
    }
    

  }
  discardPile(): Deck {
    return this.discardP;
  }
  playerInTurn(): number | undefined {
   return this.hasEnded() ? undefined : this.currentPlayerInTurn;
  }
  playerHand(player: number): Card[]{
    return this.players.at(player)!.cards;
  }

  play(index: number, color?: deck.Color) {
    let whoPlayed = this.currentPlayerInTurn;
    if (index < 0) throw Error("Non-existent card.");

    this.players[this.currentPlayerInTurn].turnStarted = true;
    
    if (!this.canPlay(index)) throw Error("Illegal move");
    let card = this.players.at(this.currentPlayerInTurn)?.cards.splice(index,1)[0];
    

    if (card?.type === "WILD" || card?.type === "WILD DRAW") {
      if (!color) {
        throw Error("Have to choose a color on a wild card");
      }
      this.chosenColor = color;
    } else {
      this.chosenColor = undefined;
      if (color) throw Error("Can't choose a color.")
    }

    this.discardP.cards.unshift(card!);
    if(card!.type === "SKIP") {
      this.skip = 1;
    }
    if(card!.type === "REVERSE") {
      if (this.playerCount === 2) this.skip = 1;
      else this.direction = -this.direction;
    }
    
    if (card!.type === "DRAW") {
      let playerToDrawCards = this.getNextPlayer(this.currentPlayerInTurn);
      for (let index = 0; index < 2; index++) {
        let cardToDraw = this.drawP.deal();
        if (!cardToDraw) {
          this.reshuffle();
          cardToDraw = this.drawP.deal();
        }
        this.players.at(playerToDrawCards)?.cards.push(cardToDraw);
   
      }
      
      this.currentPlayerInTurn = this.moveToNextPlayer();
    }

    if (card!.type === "WILD DRAW") {
      let playerToDrawCards = this.getNextPlayer(this.currentPlayerInTurn);

      for (let index = 0; index < 4; index++) {
        let cardToDraw = this.drawP.deal();
        if (!cardToDraw) {
          this.reshuffle();
          cardToDraw = this.drawP.deal();
        }
        this.players.at(playerToDrawCards)?.cards.push(cardToDraw);
        
      }
      this.currentPlayerInTurn = this.moveToNextPlayer();
      this.chosenColor = color;
    }

    if (this.playerHand(whoPlayed).length === 0) {
      this.isEmptyHand = true;
      let winner = this.winner();
      const event = { winner };
      this.endCallbacks.forEach(callback => {
        callback(event);
      });
    }

    this.currentPlayerInTurn = this.moveToNextPlayer();
    
    return card;
  }

  draw() {
    if (this.hasEnded()) throw Error("Can't draw, round has ended.");

    let numberOfCardsInDrawP = this.drawP.cards.length;
    let drawCard = this.drawP.deal();

    if (numberOfCardsInDrawP == 1) {
      this.reshuffle();
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

  private getNextPlayer(index: number): number {
    const nextPlayer = index + this.direction;
    return (nextPlayer % this.playerCount + this.playerCount) % this.playerCount;
  }
  
  private getPreviousPlayer(index: number): number {
    const previousPlayer = index - this.direction;
    return (previousPlayer % this.playerCount + this.playerCount) % this.playerCount;
  } 

  private resetDeclaredUnoState() {
    this.players.forEach(element => {
      element.declaredUno = false;
    });
  }

  private reshuffle() {
      const newDrawDeck = [...this.discardP.cards]; // move all cards from discard pile to draw pile
      this.drawP = new deck.UnoDeck(newDrawDeck);   // create a new draw pile
      this.drawP.shuffle(this.shuffler);

      let discard: Card[] = [this.drawP.deal()];
      this.discardP = new deck.UnoDeck(discard);
  }

  private calculateScore() : number {
    let score = 0;
    for (const player of this.players) {
      player.cards.forEach(card => {
        if (card.type === "SKIP" || card.type === "REVERSE" || card.type === "DRAW") score += 20;
        else if (card.type === "WILD DRAW" || card.type === "WILD") score += 50;
        else score+= card.number!;
      });
    }
    return score;
  }
  
} 
