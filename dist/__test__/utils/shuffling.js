import { standardShuffler } from "../../src/utils/random_utils";
import { is, not } from "./predicates";
import { createHand } from "./test_adapter";
export function constrainedShuffler(...constraints) {
    return (cards) => {
        constraints.sort(([a, _], [b, __]) => a - b);
        standardShuffler(cards);
        let foundCards = [];
        for (let i = 0; i < constraints.length; i++) {
            let [_, predicate] = constraints[i];
            const foundIndex = cards.findIndex(predicate);
            if (foundIndex === -1)
                throw new Error('Unsatisfiable predicate');
            foundCards.push(cards[foundIndex]);
            cards.splice(foundIndex, 1);
        }
        for (let i = 0; i < constraints.length; i++) {
            let [index] = constraints[i];
            cards.splice(index, 0, foundCards[i]);
        }
    };
}
export function memoizingShuffler(shuffler) {
    let memo = [];
    function shuffle(cards) {
        shuffler(cards);
        memo = [...cards];
    }
    return { shuffler: shuffle, get memo() { return memo; } };
}
export function successiveShufflers(...shufflers) {
    let index = 0;
    let shuffler = shufflers[index];
    return (cards) => {
        shuffler(cards);
        if (index < shufflers.length - 1)
            index++;
        shuffler = shufflers[index];
    };
}
export function shorteningShuffler(size, shuffler) {
    function shorteningShuffler(cards) {
        shuffler(cards);
        cards.splice(size);
    }
    return shorteningShuffler;
}
export function createHandWithShuffledCards(props) {
    const shuffler = props.shuffler ?? standardShuffler;
    let shuffledCards = [];
    let memoShuffler = memoizingShuffler(shuffler);
    const hand = createHand({
        players: props.players ?? ['a', 'b', 'c', 'd'],
        dealer: props.dealer ?? 1,
        shuffler: memoShuffler.shuffler
    });
    return [hand, memoShuffler.memo];
}
export function shuffleBuilder({ players, cardsPerPlayer: cardsInHand } = { players: 4, cardsPerPlayer: 7 }) {
    const constraints = new Map();
    const topOfDiscardPile = players * cardsInHand;
    let currentIndex = 0;
    let repetition = 1;
    function constrain(preds) {
        for (let i = 0; i < repetition; i++) {
            for (let pred of preds) {
                constraints.set(currentIndex++, pred);
            }
        }
        repetition = 1;
        return builder;
    }
    const builder = {
        discard() {
            currentIndex = topOfDiscardPile;
            repetition = 1;
            return builder;
        },
        drawPile() {
            currentIndex = topOfDiscardPile + 1;
            repetition = 1;
            return builder;
        },
        hand(player) {
            currentIndex = player * cardsInHand;
            repetition = 1;
            return builder;
        },
        top() {
            currentIndex = 0;
            repetition = 1;
            return builder;
        },
        repeat(n) {
            repetition = n;
            return builder;
        },
        is(...specs) {
            return constrain(specs.map(is));
        },
        isnt(...specs) {
            return constrain(specs.map(spec => not(is(spec))));
        },
        build: () => constrainedShuffler(...constraints.entries())
    };
    return builder;
}
//# sourceMappingURL=shuffling.js.map