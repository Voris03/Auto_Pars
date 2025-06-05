import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем токен авторизации, если он есть
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      // Если headers — это AxiosHeaders
      if (typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Authorization", `Bearer ${token}`);
      } else {
        (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
);

export default axiosInstance;