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
// import axios from "axios";

// const apiInstance = axios.create({
//   baseURL: "http://localhost:3333/v1",
//   // baseURL: "https://nodeapi.globalfc.app/v1",
// });

// // Request interceptor
// apiInstance.interceptors.request.use(
//   (config) => {
//     const authToken = localStorage.getItem("gfcadmintoken");
//     config.headers.Authorization = `Bearer ${authToken}`;
//     return config;
//   },
//   (error) => {
//     console.error("Request Error Interceptor:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// apiInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiInstance;
