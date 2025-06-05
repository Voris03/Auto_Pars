// src/services/productsService.ts
import axios from "../api/axiosInstance";

export const getAllProducts = async (params: { page: number; limit: number; filters: { brand: string; model: string; year: string; body: string; engine: string; modification: string; }; }) => {
  const res = await axios.get("/products", { params });
  return res.data;
};