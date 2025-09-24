import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:3000/api'
      : 'https://deepai-backend.onrender.com/api',
  withCredentials: true,
});

// import axios from 'axios';

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true, // to send cookies
// });
