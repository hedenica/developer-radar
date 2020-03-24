import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.130:3333', //utiliza a porta 3333 do backend
});

export default api;