import axios from "axios";

// IMPORTANT:
// If you use Vite proxy, set baseURL to "" and use "/api" URLs.
// Otherwise set baseURL to "http://localhost:8081".
const adminClient = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 20000,
});

// Add a request interceptor to attach the JWT token
adminClient.interceptors.request.use(
  (config) => {
    // Try to get token from various possible storage keys
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("pharmacyToken") ||
      localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminClient;
