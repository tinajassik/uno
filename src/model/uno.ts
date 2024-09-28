import { Hand } from "./hand";

export interface Game {
  currentHand(): Hand;
  winner(): any;
  score(arg0: number): any;
  targetScore: any;
  playerCount: any;
  player(arg0: number): any;
    
}

export function createGame(props: uno.Props): Game {
  throw new Error('Function not implemented.');
}
