import axios from 'axios';

const USER_BASE_URL = 'http://localhost:3000/user';

export const signup = (signupData: { username: string; password: string }) => {
    return axios.post(`${USER_BASE_URL}/register`, signupData);
};

export const login = (loginData: { username: string; password: string }) => {
    return axios.post(`${USER_BASE_URL}/login`, loginData);
};