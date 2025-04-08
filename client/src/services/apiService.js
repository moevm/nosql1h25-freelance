import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// GET
export const fetchData = async () => {
    try {
        const response = await api.get('/data');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// POST
export const sendData = async (data) => {
    try {
        const response = await api.post('/data', data);
        return response.data;
    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    }
};