import { shuffleBuilder } from "../../__test__/utils/shuffling";
import { Shuffler } from "../utils/random_utils";
import { Card } from "./deck";
import { createHand, Hand } from "./hand";

export interface Game {
  getCurrentHand(): Hand | undefined;
  getWinner(): number | undefined;
  score(player: number): number;
  targetScore: any;
  playerCount: any;
  player(index: number): string;
    
}

export type Props = {
  players: string[];
  targetScore: number;
  randomizer: () => number;
  shuffler: Shuffler<Card>;
  cardsPerPlayer: number;
}

export function createGame(props: Partial<Props>): Game {
  return new UnoGame(props)
}

class UnoGame implements Game {
  targetScore: number = 500;
  playerCount: number = 2;
  randomizer?: () => number;
  players: string[] = ['A','B'];
  scores: number[] = [0,0];
  winner: number | undefined;
  currentHand: Hand | undefined;
  shuffler: Shuffler<Card>;
  cardsPerPlayer: number = 7;

  constructor(props: Partial<Props>) {
    if(props.players) {

      if (props.players.length < 2) throw Error('Not enough players');

      this.players = props.players;
      this.playerCount = props.players.length
      this.players.forEach(player => this.scores.push(0));
    }
    if (props.targetScore || props.targetScore === 0) {
      if (props.targetScore < 1) throw Error('Illegal Target Score');
      this.targetScore = props.targetScore;
    }
    let dealer = 0;
    if (props.randomizer) {
      this.randomizer = props.randomizer;
      dealer = this.randomizer();
    } 
     this.shuffler = shuffleBuilder({players: this.players.length, cardsPerPlayer: 7}).build();
    if (props.shuffler) {
      this.shuffler = props.shuffler;
    }
    
    if (props.cardsPerPlayer) {
      this.cardsPerPlayer = props.cardsPerPlayer;
    }
    this.currentHand = createHand(this.players,dealer, this.shuffler, this.cardsPerPlayer);
      // Set up the end of hand callback to update scores and start a new hand
    this.currentHand.onEnd(this.onHandEnd.bind(this));
  }


  getCurrentHand(): Hand | undefined{
    return this.currentHand;
  }
  getWinner(): number | undefined{
    return this.winner;
  }
  score(player: number) : number{
    return this.scores[player];
  }
  
  player(index: number) : string{
    if(index < 0 || index > this.playerCount - 1) {
      throw new Error("Index out of bound");
    }
    return this.players[index];
  }

  onHandEnd(event: { winner: number | undefined }): number {
    if (event.winner !== undefined) {
      const handScore = this.currentHand!.score();
      if (handScore !== undefined) {
        this.scores[event.winner] += handScore;
      }
      if (this.scores[event.winner] >= this.targetScore) {
        this.winner = event.winner;
        this.currentHand = undefined;
      } else {
        this.startNewHand();
      }
      return handScore || 0;  // Or return an appropriate value here
    }
    return 0;  // Return a fallback value
  }
  

  startNewHand() {
    let dealer = this.randomizer ? this.randomizer() : 0;
    this.currentHand = createHand(this.players, dealer, this.shuffler, this.cardsPerPlayer);
    this.currentHand.onEnd(this.onHandEnd.bind(this)); // Set up the callback for the new hand
  }
}
