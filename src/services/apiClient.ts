import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from auth store
    // Note: We need to access the store state directly
    const state = useAuthStore.getState();
    const token = state.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    // Check if the business logic indicates failure despite 200 OK
    if (response.data && response.data.success === false) {
      const message = response.data.messageCodes?.[0] || 'Operation failed';
      console.error('API Error:', message, response.data);
      // Reject with an error that includes the message
      return Promise.reject(new Error(message));
    }
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Handle unauthorized access (e.g., clear token and redirect to login)
      const { logout } = useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
