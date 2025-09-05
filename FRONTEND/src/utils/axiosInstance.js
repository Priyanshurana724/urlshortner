import axios from "axios";

// Use environment variable for backend URL (Vercel sets this at build time)
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10s
  withCredentials: true, // send cookies/JWTs
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within 2xx
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error("Bad Request:", data);
          break;
        case 401:
          console.error("Unauthorized:", data);
          // optional: redirect to login or refresh token
          break;
        case 403:
          console.error("Forbidden:", data);
          break;
        case 404:
          console.error("Not Found:", data);
          break;
        case 500:
          console.error("Server Error:", data);
          break;
        default:
          console.error(`Error (${status}):`, data);
      }
    } else if (error.request) {
      // The request was made but no response received
      console.error("Network Error: No response received", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error:", error.message);
    }

    // Customize error before rejecting
    return Promise.reject({
      message:
        error.response?.data?.message || error.message || "Unknown error occurred",
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default axiosInstance;
