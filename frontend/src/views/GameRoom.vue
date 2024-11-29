<template>
  <div class="game-room">
    <!-- Render players dynamically -->
    <div
      v-for="(player, index) in gameState.players"
      :key="player.name"
      :class="`player player-${getPosition(index)}`"
    >
      <p>{{ player.name }} ({{ player.cards.length }} cards)</p>
      <div class="cards">
        <div
          v-for="(card, cardIndex) in player.cards"
          :key="cardIndex"
          class="card"
        >
          <!-- Show card details and images only for the current player -->
          <img
            v-if="index === gameState.currentPlayerIndex"
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
            v-if="gameState.discardPile[0]"
            :src="getCardImage(gameState.discardPile[0])"
            alt="Discarded Card"
            class="card-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted } from "vue";
import socket from "@/services/socketService";

// Define card interface
type Card = {
  color: string;
  type: string;
  number?: number; // Optional for numbered cards
};

// Define player interface
type Player = {
  name: string;
  cards: Card[];
};

// Define game state interface
type GameState = {
  players: Player[];
  discardPile: Card[];
  drawPile: Card[];
  currentPlayerIndex: number;
};

export default {
  name: "GameRoom",
  setup() {
    // Reactive game state
    const gameState = reactive<GameState>({
      players: [],
      discardPile: [],
      drawPile: [],
      currentPlayerIndex: -1,
    });

    // Determine player positions for UI
    const getPosition = (index: number) => {
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
      const basePath = "/assets/images/cards/";

      if (card.type === "NUMBERED") {
        return `${basePath}${card.color.toLowerCase()}/${card.number}.png`;
      } else if (["SKIP", "REVERSE", "DRAW"].includes(card.type)) {
        return `${basePath}${card.color.toLowerCase()}/${card.type.toLowerCase()}.png`;
      } else if (card.type === "WILD" || card.type === "WILD DRAW") {
        return `${basePath}wild/${card.type.toLowerCase().replace(" ", "-")}.png`;
      } else {
        return `${basePath}card-back.png`; // Default card-back image
      }
    };

    // Fetch and update game state on mount
    onMounted(() => {
      // Listen for game state updates from the backend
      socket.on("gameStateUpdate", (state: GameState) => {
        gameState.players = state.players;
        gameState.discardPile = state.discardPile;
        gameState.drawPile = state.drawPile;
        gameState.currentPlayerIndex = state.currentPlayerIndex;
      });

      // Emit a request to start a single-player game for testing
      socket.emit("startGame", { isSinglePlayer: true, numBots: 3 });
    });

    return { gameState, getPosition, getCardImage };
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
  background: gray;
  border-radius: 8px;
}
</style>