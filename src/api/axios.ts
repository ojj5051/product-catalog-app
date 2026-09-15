import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data || "Something went wrong";
    return Promise.reject(message);
  },
);

export default axiosInstance;
