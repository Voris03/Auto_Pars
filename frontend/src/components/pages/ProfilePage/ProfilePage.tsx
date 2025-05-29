import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "../../../api/axiosInstance";

// Типы
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productSnapshot: {
    name: string;
    brand?: string;
    image?: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  shippingAddress: string;
  notes: string;
  items: OrderItem[];
}

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке заказов:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Загрузка профиля...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Мой профиль
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={1}>
          <Typography>
            <strong>Имя:</strong> {user.firstName} {user.lastName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography>
            <strong>Телефон:</strong> {user.phone || "—"}
          </Typography>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
          >
            Выйти
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h5" gutterBottom>
        История заказов
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : orders.length === 0 ? (
        <Typography>У вас пока нет заказов.</Typography>
      ) : (
        orders.map((order) => (
          <Paper key={order.id} sx={{ p: 2, mb: 2 }}>
            <Typography>
              <strong>Номер:</strong> {order.id}
            </Typography>
            <Typography>
              <strong>Статус:</strong> {order.status}
            </Typography>
            <Typography>
              <strong>Сумма:</strong> {order.total.toFixed(2)} RUB
            </Typography>
            <Typography>
              <strong>Адрес:</strong> {order.shippingAddress}
            </Typography>
            <Typography>
              <strong>Комментарий:</strong> {order.notes || "—"}
            </Typography>
            <Typography>
              <strong>Дата:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </Typography>

            <Divider sx={{ my: 1 }} />
            <Typography>
              <strong>Товары:</strong>
            </Typography>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.productSnapshot?.name || "—"} × {item.quantity} шт. —{" "}
                  {item.price.toFixed(2)} RUB
                </li>
              ))}
            </ul>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ProfilePage;
 