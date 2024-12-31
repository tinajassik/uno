<template>
  <div class="game-room">
    <!-- Render players dynamically -->
    <div
        v-for="(player, index) in players"
        :key="player"
        :class="`player player-${getPosition(index)}`"
    >
      <p>{{ player }} ({{ getPlayerHandSize(index) }} cards)</p>
      <p>Here</p>
      <div class="cards">
        <div
            v-for="(card, cardIndex) in getPlayerCards(index)"
            :key="cardIndex"
            class="card"
        >
          <!-- Show card details and images only for the current player -->
          <img
              v-if="currentPlayer === index"
              :src="getCardImage(card)"
              alt="Card"
              class="card-image"
          />
          <div v-else class="card-back"></div>
        </div>
      </div>
    </div>

    <!-- Center Area for Deck and Discard Pile -->
    <div class="center-area">
      <div class="deck">
        <p>Deck</p>
        <div class="card-back deck-card"></div>
      </div>
      <div class="discard-pile">
        <p>Discard</p>
        <div class="card">
          <img
              v-if="currentHand?.discardPile()?.top()"
              :src="getCardImage(currentHand.discardPile().top())"
              alt="Discarded Card"
              class="card-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/store/gameStore";
import { addSocketListener, removeSocketListener } from "@/services/socketService";
import type { Card } from "@shared/deck";
import type {Hand} from "@shared/hand";

export default {
  name: "GameRoom",
  setup() {
    const gameStore = useGameStore();

    // Reactive computed properties
    const players = computed(() => gameStore.players);
    const currentHand = computed(() => gameStore.currentHand);
    const currentPlayer = computed(() => gameStore.currentPlayer);
    const game = computed(() => gameStore.game)

    // Helper to get a player's cards
    const getPlayerCards = (index: number): Card[] =>
        currentHand.value?.playerHand(index) || [];

    // Helper to get a player's hand size
    const getPlayerHandSize = (index: number): number =>
        getPlayerCards(index).length;

    // Determine player positions for UI
    const getPosition = (index: number): string => {
      switch (index) {
        case 0:
          return "top";
        case 1:
          return "left";
        case 2:
          return "right";
        default:
          return "bottom";
      }
    };

    // Map card to its image path
    const getCardImage = (card: Card): string => {
      const basePath = "src/assets/images/cards/";

      if (card.type === "NUMBERED") {
        return `${basePath}${card.color?.toLowerCase()}/${card.number}.png`;
      } else if (["SKIP", "REVERSE", "DRAW"].includes(card.type)) {
        return `${basePath}${card.color?.toLowerCase()}/${card.type.toLowerCase()}.png`;
      } else if (card.type === "WILD" || card.type === "WILD DRAW") {
        return `${basePath}wild/${card.type.toLowerCase().replace(" ", "-")}.png`;
      } else {
        return `${basePath}card-back.png`; // Default card-back image
      }
    };

    // Handle game state update
    const handleGameUpdate = (data: any) => {
      console.log("Game state updated in GameRoom:", data);
    };

    // Fetch initial game state on mount
    onMounted(() => {
      // addSocketListener("game:update", handleGameUpdate);

      // Fetch the initial game state if needed
      // if (!gameStore.game) {
      //   gameStore.fetchGameState(gameStore.lobbyId || "");
      // }
      console.log("Game state on mount:", game.value);
      console.log("Players on mount:", players.value);
      console.log("Current hand on mount:", currentHand.value);
    });

    // Clean up listeners on unmount
    onUnmounted(() => {
      // removeSocketListener("game:update");
    });

    return {
      players,
      currentHand,
      currentPlayer,
      game,
      getPlayerCards,
      getPlayerHandSize,
      getPosition,
      getCardImage,
    };
  },
};
</script>

<style scoped>
/* Layout for the game room */
.game-room {
  background-color: #44596d;
  display: grid;
  grid-template-areas:
    "top top top top"
    "left center center right"
    "bottom bottom bottom bottom";
  grid-template-rows: 1fr 2fr 1fr;
  height: 100vh;
  color: #ecf0f1;
  padding: 20px;
  gap: 10px;
}

/* Styling for players */
.player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #bdc3c7;
}

.player p {
  margin: 0 0 8px;
  font-weight: bold;
}

/* Card layout styles */
.card-row,
.card-column {
  display: flex;
  gap: 8px;
}

.card-row {
  flex-direction: row;
}

.card-column {
  flex-direction: column;
}

/* Center area for the deck and discard pile */
.center-area {
  grid-area: center;
  display: flex;
  gap: 30px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.deck,
.discard-pile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background-color: #2c3e50;
  border-radius: 8px;
}

/* Card styling */
.card {
  width: 50px;
  height: 75px;
  border-radius: 8px;
  background-color: #ecf0f1;
}

.card img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.card-back {
  width: 50px;
  height: 75px;
  background: grey;
  border-radius: 8px;
}
</style>
