import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKENDURL, // Base URL for your API
  withCredentials: true, // Ensure credentials (like cookies) are included in requests
});

export default axiosInstance;
