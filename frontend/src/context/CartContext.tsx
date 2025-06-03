import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";

// Интерфейс товара (для добавления в корзину)
export interface SnapshotProduct {
  id: number; // числовой ID товара
  name: string;
  price: number;
  brand?: string;
  image?: string;
}

// Элемент корзины
export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  productBrand?: string;
  productImage?: string;
}

// Тип контекста
interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: SnapshotProduct, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
}

// Создание контекста
const CartContext = createContext<CartContextType | undefined>(undefined);

// Провайдер
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  // Пересчёт вручную (на случай, если с бэка не придёт total)
  const calculateTotal = (cart: CartItem[]) =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Загрузка корзины
  const loadCart = async () => {
    try {
      const res = await axios.get("/cart");
      const data = res.data;
      setItems(data.items || []);
      setTotal(data.total || calculateTotal(data.items || []));
    } catch (err) {
      console.error("Ошибка загрузки корзины:", err);
    }
  };

  // Добавление в корзину
  const addToCart = async (product: SnapshotProduct, quantity = 1) => {
    try {
      if (!product?.id) throw new Error("productId отсутствует");
      await axios.post("/cart/items", {
        productId: Number(product.id),
        quantity,
      });
      await loadCart();
    } catch (err) {
      console.error("Ошибка добавления в корзину:", err);
    }
  };

  // Удаление из корзины
  const removeFromCart = async (itemId: string) => {
    try {
      await axios.delete(`/cart/items/${itemId}`);
      await loadCart();
    } catch (err) {
      console.error("Ошибка удаления из корзины:", err);
    }
  };

  // Очистка корзины
  const clearCart = async () => {
    try {
      await axios.delete("/cart");
      await loadCart();
    } catch (err) {
      console.error("Ошибка очистки корзины:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{ items, total, addToCart, removeFromCart, clearCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Хук
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

// Вспомогательный метод (если хочешь вызвать вне хука)
export const addToCartApi = async (product: SnapshotProduct, quantity = 1) => {
  return axios.post("/cart/items", {
    productId: Number(product.id),
    quantity,
  });
};