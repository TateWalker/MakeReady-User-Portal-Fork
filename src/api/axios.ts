import axios, { InternalAxiosRequestConfig } from "axios";

const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken && config.headers) {
    const token = JSON.parse(accessToken).token;
    config.headers.Authorization = token;
  }
  return config;
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(requestInterceptor, (error) => {
  Promise.reject(error);
});

export default axiosInstance;
