/**
 * Application Configuration
 */
const config = {
  // Backend API Base URL
  // Sourced from environment variable VITE_API_BASE_URL
  // Defaults to localhost:8080 if not set
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.31.248:8080',
};

export default config;
