import axis from 'axios';

const API = axis.create({
    baseURL: 'http://localhost:5000/api', // Maps perfectly to the backend port
});

// Automatically inject JWT token into headers for secured routes
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;