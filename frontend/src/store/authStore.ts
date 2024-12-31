import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as authService from '@/services/authService';
import { AxiosError } from 'axios';

interface AuthState {
  user: { username: string } | null;
  userId: string | null;
  token: string | null;
  successMessage: string;
  errorMessage: string;
}

export const useAuthStore = defineStore('auth', () => {
  // const user = ref<{ username: string } | null>(null);
  // const userId = ref<string | null>(null);
  // const token = ref<string | null>(null);
  // const errorMessage = ref('');
  // const successMessage = ref('');

  const user = ref<AuthState['user']>(null);
  const userId = ref<AuthState['userId']>(null);
  const token = ref<AuthState['token']>(null);
  const successMessage = ref<AuthState['successMessage']>('');
  const errorMessage = ref<AuthState['errorMessage']>('');

  const signup = async (signupData: { username: string; password: string }) => {
    try {
      const response = await authService.signup(signupData);
      successMessage.value = response.data.message;
      errorMessage.value = '';
    } catch (error) {
      successMessage.value = '';
      if (error instanceof AxiosError && error.response && error.response.data) {
        errorMessage.value = error.response.data.message || 'Signup failed';
      } else {
        errorMessage.value = 'An unexpected error occurred';
      }
    }
  };

  const login = async (loginData: { username: string; password: string }) => {
    try {
      const response = await authService.login(loginData);
      token.value = response.data.token;
      user.value = { username: loginData.username };
      userId.value = response.data.user.id;
      successMessage.value = response.data.message;
      errorMessage.value = '';
           localStorage.setItem('token', response.data.token);
           localStorage.setItem('user', JSON.stringify(user.value));
           localStorage.setItem('userId', response.data.user.id);
    } catch (error) {
      successMessage.value = '';
      if (error instanceof AxiosError && error.response && error.response.data) {
        errorMessage.value = error.response.data.message || 'Login failed';
      } else {
        errorMessage.value = 'An unexpected error occurred';
      }
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    userId.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  };

  const clearMessages = () => {
    successMessage.value = '';
    errorMessage.value = '';
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // localStorage.removeItem('userId');
  };

  return { user, token, userId, signup, login, logout, successMessage, errorMessage, clearMessages };
});