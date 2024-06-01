import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log("token : ",token);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/home'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
