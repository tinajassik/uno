<template>
    <div class="game-over">
        <h1>Game Over</h1>
        <button @click="startNewGame">Start New Game</button>
    </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';

export default {
    name: 'GameOver',
    setup() {
        const router = useRouter();

        const startNewGame = () => {
            console.log('Starting a new game');
            router.push({ name: 'GameSetup' });
        };

        return {
            startNewGame,
        };
    },
};
</script>

<style scoped>
.game-over {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
}
</style>