<template>
  <AppHeader />
  <div class="game-setup">
    <div class="options">
      <div class="option" @click="selectMode('bots')">
        <img src="@/assets/images/misc/play_with_bots.jpg" alt="Bots" />
        <p>Play Against Bots</p>
      </div>
      <div class="option" @click="openLobbyModal">
        <img src="@/assets/images/misc/play_with_friends.png" alt="Friends" />
        <p>Play with Friends</p>
      </div>
    </div>

    <div v-if="showLobbyModal" class="modal-overlay" @click.self="closeLobbyModal">
      <div class="modal-content">
        <h2 v-if="!isCreatingRoom">Match List</h2>
        <h2 v-else>Create Room</h2>
        
        <div v-if="!isCreatingRoom">
          <input v-model="searchQuery" placeholder="Find a room..." class="search-box" />
          <div class="lobby-list">
            <div v-for="lobby in filteredLobbies" :key="lobby.id" class="lobby-item">
              <span>{{ lobby.name }} ({{ lobby.players }}/{{ lobby.maxPlayers }})</span>
              <span :class="{ full: lobby.isFull }">{{ lobby.isFull ? 'Full' : 'Open' }}</span>
            </div>
          </div>
          <button @click="fetchLobbies">Update</button>
          <div class="actions">
            <button @click="toggleCreateRoom">Create Match</button>
            <button @click="closeLobbyModal">Back</button>
          </div>
        </div>

        <div v-if="isCreatingRoom" class="create-room">
          <input v-model="roomName" type="text" placeholder="Enter room name" />
          <select v-model="numberOfPlayers">
            <option v-for="n in 7" :key="n" :value="n">{{ n }} Players</option>
          </select>
          <div class="actions">
            <button @click="createRoom">Create Room</button>
            <button @click="toggleCreateRoom">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AppHeader from '@/components/AppHeader.vue';

export default {
  name: 'GameSetup',
  components: {
    AppHeader,
  },
  setup() {
    const router = useRouter();
    const showLobbyModal = ref(false);
    const lobbies = ref([]);
    const searchQuery = ref('');
    const isCreatingRoom = ref(false);
    const roomName = ref('');
    const numberOfPlayers = ref(2);

    const openLobbyModal = () => {
      showLobbyModal.value = true;
      fetchLobbies();
    };

    const closeLobbyModal = () => {
      showLobbyModal.value = false;
      isCreatingRoom.value = false;
      roomName.value = '';
      numberOfPlayers.value = 2;
    };

    const fetchLobbies = async () => {
      try {
        const response = await axios.post('/Game/getAllGames');
        lobbies.value = response.data;
      } catch (error) {
        console.error('Error fetching lobbies:', error);
      }
    };

    const filteredLobbies = computed(() =>
      lobbies.value.filter((lobby) =>
        lobby.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const toggleCreateRoom = () => {
      isCreatingRoom.value = !isCreatingRoom.value;
      if (!isCreatingRoom.value) {
        roomName.value = '';
        numberOfPlayers.value = 2;
      }
    };

    const createRoom = async () => {
      if (!roomName.value) {
        alert('Please enter a room name');
        return;
      }

      try {
        const response = await axios.post('/Game/createGameLobby', {
          name: roomName.value,
          maxPlayers: numberOfPlayers.value,
        });
        console.log('Room created:', response.data);
        closeLobbyModal();
        fetchLobbies();
      } catch (error) {
        console.error('Error creating room:', error);
      }
    };

    const selectMode = (mode: string) => {
      console.log(`Selected mode: ${mode}`);
      if (mode === 'bots') {
        router.push({ name: 'GameWithBots' });
      }
    };

    return {
      selectMode,
      showLobbyModal,
      openLobbyModal,
      closeLobbyModal,
      searchQuery,
      lobbies,
      filteredLobbies,
      fetchLobbies,
      isCreatingRoom,
      toggleCreateRoom,
      roomName,
      numberOfPlayers,
      createRoom,
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90vw;
  text-align: center;
}

.search-box {
  width: 100%;
  padding: 8px;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.lobby-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.lobby-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.lobby-item .full {
  color: red;
}

.actions button {
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}

.actions button:hover {
  background-color: #0056b3;
}

.create-room input,
.create-room select {
  width: 100%;
  padding: 8px;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>