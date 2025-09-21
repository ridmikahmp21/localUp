import axios from "axios";

const cartAPI = axios.create({
  baseURL: "http://localhost:5000/api/cart",
  withCredentials: true,
});

cartAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default cartAPI;
