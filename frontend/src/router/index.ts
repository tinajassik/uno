import { createRouter, createWebHistory } from 'vue-router'
import GameSetup from './../views/GameSetup.vue';
import GameOver from './../views/GameOver.vue';
import Home from './../views/Home.vue';


const routes = [
  { path: '/game-setup', name: 'GameSetup', component: GameSetup },
  { path: '/game-over', name: 'GameOver', component: GameOver },
  { path: '/', name: 'HomePage', component: Home }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;