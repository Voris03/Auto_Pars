import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    // Проверка: headers может быть либо объектом, либо AxiosHeaders
    if (typeof (config.headers as any).set === "function") {
      // В случае AxiosHeaders
      (config.headers as any).set("Authorization", `Bearer ${token}`);
    } else if (typeof config.headers === "object") {
      // В случае обычного объекта
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;