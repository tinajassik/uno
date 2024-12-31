<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import {useGameStore} from "@/store/gameStore";
import {useAuthStore} from "@/store/authStore";
import {initializeSocket} from "@/services/socketService";

export default {
  name: 'App',

  setup() {
    // const gameStore = useGameStore();
    //
    // // Initialize socket listeners when the app loads
    // gameStore.initializeSocketListeners();

    return {};
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>