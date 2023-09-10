// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001', // Replace with your API base URL
});

// Add an interceptor to include the token from session storage in the headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['authorization'] = token;
    }
    return config;
});

export default axiosInstance;
