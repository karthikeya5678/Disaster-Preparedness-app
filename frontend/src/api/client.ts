import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://disaster-backend.onrender.com';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client;
