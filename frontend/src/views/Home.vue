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
        <form @submit.prevent="handleSignup">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="signupForm.username" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="signupForm.email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="signupForm.password" required />
          </div>
          <div class="buttons">
            <button type="submit" class="signup-button">Create Account</button>
            <button type="button" class="back-button" @click="setCurrentView('home')">Back</button>
          </div>
        </form>
      </div>

      <div v-if="currentView === 'login'" class="form-container">
        <h2>Log In</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login-username">Username</label>
            <input type="text" id="login-username" v-model="loginForm.username" required />
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" v-model="loginForm.password" required />
          </div>
          <div class="buttons">
            <button type="submit" class="login-button">Log In</button>
            <button type="button" class="back-button" @click="setCurrentView('home')">Back</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter();
    const currentView = ref('home'); // Can be home, signup, or login
    
    console.log(currentView.value);

    const signupForm = ref({
      username: '',
      email: '',
      password: ''
    });

    const loginForm = ref({
      username: '',
      password: ''
    });

    const setCurrentView = (view: string) => {
      currentView.value = view;
    };

    const handleSignup = () => {
      console.log('Sign up form data:', signupForm.value);
      // Reset form fields
      signupForm.value = {
        username: '',
        email: '',
        password: ''
      };
      // Go back to home after successful signup
      setCurrentView('home');
    };

    const handleLogin = () => {
      console.log('Log in form data:', loginForm.value);
      // Reset form fields
      loginForm.value = {
        username: '',
        password: ''
      };
      // Setup game after sucessful login
      router.push({ name: 'GameSetup' });
    };

    return {
      currentView,
      signupForm,
      loginForm,
      setCurrentView,
      handleSignup,
      handleLogin
    };
  },
};
</script>

<style scoped>
.home {
  height: 100vh;
  width: 100vw;
  background-image: url('@/assets/images/unoBackgroundImage.png');
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
}

.back-button:hover {
  background-color: #666666;
  transform: scale(1.05);
}

.form-container {
  margin-top: 0px;
  text-align: left;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #ffd700;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  box-sizing: border-box;
}
</style>
