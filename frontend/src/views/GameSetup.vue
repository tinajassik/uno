<template>
  <AppHeader />
  <div class="game-setup">
    <div class="options">
      <div class="option" @click="selectMode('bots')">
        <img src="@/assets/images/misc/play_with_bots.jpg" alt="Bots" />
        <p>Play Against Bots</p>
      </div>
      <div class="option" @click="selectMode('friends')">
        <img src="@/assets/images/misc/play_with_friends.png" alt="Friends" />
        <p>Play with Friends</p>
      </div>
    </div>

    <!-- Bot Setup Modal -->
    <div v-if="showBotSetupModal" class="modal-overlay">
      <div class="modal">
        <h3>Select Number of Bots</h3>
        <input type="number" v-model="selectedBots" min="1" max="3" />
        <button @click="startSinglePlayerGame">Start Game</button>
        <button @click="closeBotSetupModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import socket from "@/services/socketService";

export default {
  name: "GameSetup",
  components: { AppHeader },
  setup() {
    const router = useRouter();
    const showBotSetupModal = ref(false);
    const selectedBots = ref(1);

    const selectMode = (mode: string) => {
      if (mode === "bots") {
        showBotSetupModal.value = true;
      }
    };

    const startSinglePlayerGame = () => {
      socket.emit("startGame", { isSinglePlayer: true, numBots: selectedBots.value });
      router.push({ name: "GameRoom" });
    };

    const closeBotSetupModal = () => {
      showBotSetupModal.value = false;
    };

    return {
      selectMode,
      showBotSetupModal,
      selectedBots,
      startSinglePlayerGame,
      closeBotSetupModal,
    };
  },
};
</script>


<style scoped>
.game-setup {
  height: 100vh;
  width: 100vw;
  background-image: url('@/assets/images/background/setup-page.png');
  background-size: 40%;
  background-position: left center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: rgb(206, 99, 99);
  padding-right: 15rem;
}

.options {
  display: flex;
  gap: 5rem;
  align-items: center;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(197, 111, 104);
  padding: 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease;
  width: 250px;
}

.option:hover {
  transform: scale(1.05);
}

.option img {
  width: 180px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.option p {
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
  background-color: #ff4500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.match-list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
}

.match-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

button {
  margin-top: 10px;
}
</style>