import axios from "axios";
import { store } from "../app/store.js"


const api = axios.create({
  baseURL: "http://localhost:8000/api/",
})


api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;