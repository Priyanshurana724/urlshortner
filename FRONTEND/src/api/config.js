// src/api/config.js
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000"; // fallback for local dev

export default API_BASE;
