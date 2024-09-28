import { Shuffler } from "../utils/random_utils";

export interface Hand {
  dealer: any;
  player(arg0: number): any;
  playerCount: any;
  onEnd(arg0: (e: any) => number): unknown;
  score(): any;
  winner(): any;
  canPlayAny(): any;
  hasEnded(): any;
  sayUno(arg0: number): unknown;
  drawPile(): any;
  catchUnoFailure(arg0: { accuser: number; accused: number; }): any;
  canPlay(arg0: number): any;
  discardPile(): any;
  playerInTurn(): any;
  playerHand(arg0: number): any;
  play(number: number, color?: string): any;
  draw(): any;
}

export function createHand(players: string[], dealer: number, shuffler: Shuffler<deck.Card>, cardsPerPlayer: number): Hand {
  throw new Error('Function not implemented.');
}

