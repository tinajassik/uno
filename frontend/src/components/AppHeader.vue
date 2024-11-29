<!-- Header visible after login -->

<template>
  <header class="header">
    <div class="header-content">
      <h1 class="header-title">Let's Play Uno</h1>
      <div class="user-info">
        <span class="username">Hello, {{ username }}</span>
        <button class="logout-button" @click="handleLogout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

export default {
  name: 'AppHeader',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const username = computed(() => authStore.user?.username);

    const handleLogout = () => {
      authStore.logout();
      router.push({ name: 'HomePage' });
    };

    return {
      username,
      handleLogout,
    };
  },
};
</script>
  
  <style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background-color: rgb(206, 99, 99);
    color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgb(250, 126, 126);
  }
  
  .header-content {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .username {
    font-size: 1rem;
  }
  
  .logout-button {
    padding: 0.5rem 1rem;
    background-color: #3569b8;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .logout-button:hover {
    background-color: #2cad2c;
  }
  </style>  