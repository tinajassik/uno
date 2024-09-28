// Uniformly selected pseudo-random number
export const standardRandomizer = n => Math.floor(Math.random() * n);
// Perfect shuffle using the Fisher-Yates method
export function standardShuffler(cards) {
    for (let i = 0; i < cards.length - 1; i++) {
        const j = Math.floor(Math.random() * (cards.length - i) + i);
        const temp = cards[j];
        cards[j] = cards[i];
        cards[i] = temp;
    }
}
//# sourceMappingURL=random_utils.js.map