import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as authService from '@/services/authService';
import { AxiosError } from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ username: string } | null>(null);
  const token = ref<string | null>(null);
  const errorMessage = ref('');
  const successMessage = ref('');

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
      successMessage.value = response.data.message;
      errorMessage.value = '';
           localStorage.setItem('token', response.data.token);
           localStorage.setItem('user', JSON.stringify(user.value));
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const clearMessages = () => {
    successMessage.value = '';
    errorMessage.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { user, token, signup, login, logout, successMessage, errorMessage, clearMessages };
});