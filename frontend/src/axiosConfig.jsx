// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://192.168.1.21:8000/api', // Your API base URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default axiosInstance;

// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
