// import axios from 'axios';

// export const axiosInstance = axios.create({
//   baseURL:
//     import.meta.env.MODE === 'development'
//       ? 'http://localhost:3000/api'
//       : '/api',
//   withCredentials: true,
// });

import axios from 'axios';

const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/api'
    : import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
