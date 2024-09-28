import { standardShuffler } from '../../src/utils/random_utils';
import * as deck from '../../src/model/deck';
import * as hand from '../../src/model/hand';
import * as uno from '../../src/model/uno';
export function createInitialDeck() {
    return deck.createInitialDeck();
}
export function createHand({ players, dealer, shuffler = standardShuffler, cardsPerPlayer = 7 }) {
    return hand.createHand(players, dealer, shuffler, cardsPerPlayer);
}
export function createGame(props) {
    return uno.createGame(props);
}
//# sourceMappingURL=test_adapter.js.map