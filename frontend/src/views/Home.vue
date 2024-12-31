<template>
  <div class="home">
    <div class="content">
      <div v-if="currentView === 'home'">
        <h1>Let's Play Uno!</h1>
        <p>Challenge your friends or bots in the classic Uno game.</p>
      </div>

      <div v-if="currentView === 'home'" class="buttons">
        <button class="signup-button" @click="setCurrentView('signup')">Sign Up</button>
        <button class="login-button" @click="setCurrentView('login')">Log In</button>
      </div>

      <div v-if="currentView === 'signup'" class="form-container">
        <h2>Sign Up</h2>
        <input v-model="signupData.username" type="text" placeholder="Username" />
        <input v-model="signupData.password" type="password" placeholder="Password" />
        <button @click="handleSignup">Sign Up</button>
        <button class="back-button" @click="setCurrentView('home')">Back</button>
      </div>

      <div v-if="currentView === 'login'" class="form-container">
        <h2>Log In</h2>
        <input v-model="loginData.username" type="text" placeholder="Username" />
        <input v-model="loginData.password" type="password" placeholder="Password" />
        <button @click="handleLogin">Log In</button>
        <button class="back-button" @click="setCurrentView('home')">Back</button>
      </div>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h3>{{ authStore.successMessage || authStore.errorMessage }}</h3>
          <button @click="handleModalClose">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import {initializeSocket} from "@/services/socketService";

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const currentView = ref('home');
    const signupData = ref({ username: '', password: '' });
    const loginData = ref({ username: '', password: '' });
    const showModal = computed(() => !!authStore.successMessage || !!authStore.errorMessage);

    const handleSignup = async () => {
      await authStore.signup(signupData.value);
      if (authStore.successMessage) {
        setTimeout(() => {
          currentView.value = 'login';
          router.push({ name: 'Login' });
        }, 500);
        
      }
      };

    const handleLogin = async () => {
      await authStore.login(loginData.value);
      if (authStore.userId) {
        initializeSocket(authStore.userId);
        await router.replace({ name: "GameSetup" });
      }
    };

    const handleModalClose = () => {
      authStore.clearMessages();
      if (authStore.successMessage && currentView.value === 'signup') {
        setCurrentView('login');
      }
    };

    const setCurrentView = (view: string) => {
      currentView.value = view;
      if (view === 'signup') {
        signupData.value = { username: '', password: '' };
      } else if (view === 'login') {
        loginData.value = { username: '', password: '' };
      }
      authStore.clearMessages();
    };

    return {
      currentView,
      signupData,
      loginData,
      handleSignup,
      handleLogin,
      handleModalClose,
      setCurrentView,
      authStore,
      showModal,
    };
  },
};
</script>

<style scoped>
.home {
  height: 100vh;
  width: 100vw;
  background-image: url('@/assets/images/background/unoBackgroundImage.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-color: rgb(206, 99, 99);
}

.content {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  color: #ffffff;
  z-index: 2;
  width: 400px;
  max-width: 90vw;
  height: auto;
  max-height: 60vh;
  margin-top: 450px;
}

h1 {
  font-family: 'Impact', 'Bebas Neue', sans-serif;
  font-size: 2em;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 16px;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

p {
  font-family: 'Apotos', sans-serif;
  font-size: 1.4em;
  color: #eee9e9;
  margin-bottom: 24px;
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  font-size: 1.2em;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  transition: transform 0.2s, background-color 0.3s;
}

.signup-button {
  background-color: #ff4500;
  color: #ffffff;
}

.signup-button:hover {
  background-color: #e03e00;
  transform: scale(1.05);
}

.login-button {
  background-color: #32cd32;
  color: #ffffff;
}

.login-button:hover {
  background-color: #2cad2c;
  transform: scale(1.05);
}

.back-button {
  background-color: #808080;
  color: #ffffff;
  margin-top: 10px;
  margin-left: 15px;
}

.back-button:hover {
  background-color: #666666;
  transform: scale(1.05);
}

.form-container {
  margin-top: 15px;
  text-align: left;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

input {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  box-sizing: border-box;
}

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
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  color: black;
  }
</style>
