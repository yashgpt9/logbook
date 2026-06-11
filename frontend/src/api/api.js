import axios from 'axios';

const api = axios.create({
  baseURL: 'https://logbook-zt9x.onrender.com/api',
});

export default api;
