import axios from 'axios';
import API_URL from '../config/api';

const api = axios.create({
    baseURL: `${API_URL}/api`,
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            }
        } catch (e) {
            console.error('Failed to parse user data from localStorage:', e);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
