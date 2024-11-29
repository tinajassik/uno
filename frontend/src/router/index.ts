import { createRouter, createWebHistory } from 'vue-router'
import GameSetup from '../views/GameSetup.vue';
import GameOver from './../views/GameOver.vue';
import GameRoom from './../views/GameRoom.vue';
import Home from './../views/Home.vue';
import { useAuthStore } from '@/store/authStore';

const routes = [
  { path: '/game-setup', name: 'GameSetup', component: GameSetup },
  { path: '/game-over', name: 'GameOver', component: GameOver },
  { path: '/', name: 'HomePage', component: Home },
  { path: '/game-room', name: 'GameRoom', component: GameRoom }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const isAuthenticated = !!authStore.token;

  // Below -- To be fixed to ensure that user can not go back to signup page if logged in already. uno#10
  if (isAuthenticated && (to.name === 'HomePage')) {
    next({ name: 'GameSetup' });
  } else {
    next();
  }
});


export default router;