import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies automatically
});

export default axiosInstance;
