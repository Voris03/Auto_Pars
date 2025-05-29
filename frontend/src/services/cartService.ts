import axiosInstance from "../api/axiosInstance";

export const addToCartApi = (productId: string, quantity: number = 1) => {
  return axiosInstance.post("/cart/add", { productId, quantity });
};

export const getCart = () => axiosInstance.get("/cart");

export const removeFromCartApi = (itemId: string) =>
  axiosInstance.delete(`/cart/${itemId}`);

export const clearCartApi = () => axiosInstance.delete("/cart/clear");