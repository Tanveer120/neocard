import axios from 'axios';

const baseURL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000/api';

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config)=>{
  const token = localStorage.getItem('ims_token');
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
