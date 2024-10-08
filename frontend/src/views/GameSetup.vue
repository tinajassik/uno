<template>
    <div class="game-setup">
        <h1>Game Setup</h1>
        <label for="numBots">Number of Bots:</label>
        <input type="number" id="numBots" v-model="numBots" min="1" max="3" />
        <button @click="startGame">Start Game</button>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'GameSetup',
    setup() {
        const numBots = ref(1); // Default value is 1 bot
        const router = useRouter(); // Use the router to navigate to the next screen

        const startGame = () => { // logic to initiate the game, but for now it navigates to the GameOverScreen.
            console.log(`Starting game with ${numBots.value} bots`);
            router.push({ name: 'GameOver' });
        };

        return { numBots, startGame };
    },
};
</script>

<style scoped>
.game-setup {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

label {
    margin-bottom: 8px;
}

input {
    width: 50px;
    text-align: center;
    margin-bottom: 16px;
}

button {
    padding: 8px 16px;
    cursor: pointer;
}
</style>