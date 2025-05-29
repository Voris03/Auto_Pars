import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";

// Интерфейс snapshot товара
export interface SnapshotProduct {
  name: string;
  price: number;
  brand?: string;
  image?: string;
}

// Интерфейс элемента корзины
export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  productBrand?: string;
  productImage?: string;
}

// Интерфейс операций
interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: SnapshotProduct, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
}

// Контекст
const CartContext = createContext<CartContextType | undefined>(undefined);

// Провайдер
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const calculateTotal = (cart: CartItem[]) =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const loadCart = async () => {
    try {
      const res = await axios.get("/cart");
      const data = res.data;
      setItems(data.items || []);
      setTotal(data.total || calculateTotal(data.items || []));
    } catch (err) {
      console.error("Ошибка загрузки корзины", err);
    }
  };

  const addToCart = async (product: SnapshotProduct, quantity = 1) => {
    try {
      await axios.post("/cart/items", { product, quantity });
      await loadCart();
    } catch (err) {
      console.error("Ошибка добавления в корзину", err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await axios.delete(`/cart/items/${itemId}`);
      await loadCart();
    } catch (err) {
      console.error("Ошибка удаления из корзины", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/cart/clear");
      await loadCart();
    } catch (err) {
      console.error("Ошибка очистки корзины", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ items, total, addToCart, removeFromCart, clearCart, loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Хук
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// Отдельный вызов
export const addToCartApi = async (product: SnapshotProduct, quantity = 1) => {
  return axios.post("/cart/items", {
    product,
    quantity,
  });
};