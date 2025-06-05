import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axiosInstance from "../api/axiosInstance";

// Тип товара (упрощённый снимок)
export interface SnapshotProduct {
  id: number;
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

// Контекст
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
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const calculateTotal = (cart: CartItem[]) =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const loadCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      const data = res.data;
      setItems(data.items || []);
      setTotal(data.total || calculateTotal(data.items || []));
    } catch (err) {
      console.error("Ошибка загрузки корзины:", err);
    }
  };

  const addToCart = async (product: SnapshotProduct, quantity = 1) => {
    try {
      if (!product?.id) throw new Error("productId отсутствует");
      await axiosInstance.post("/cart/items", {
        productId: Number(product.id),
        quantity,
      });
      await loadCart();
    } catch (err) {
      console.error("Ошибка добавления в корзину:", err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await axiosInstance.delete(`/cart/items/${itemId}`);
      await loadCart();
    } catch (err) {
      console.error("Ошибка удаления из корзины:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete("/cart");
      await loadCart();
    } catch (err) {
      console.error("Ошибка очистки корзины:", err);
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
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart должен использоваться внутри CartProvider");
  }
  return context;
};

// Вызов отдельно
export const addToCartApi = async (product: SnapshotProduct, quantity = 1) => {
  return axiosInstance.post("/cart/items", {
    productId: Number(product.id),
    quantity,
  });
};
