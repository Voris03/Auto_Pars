import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Stack, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "../../../api/axiosInstance";

// Типы для заказов и товаров
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/users/${user?.id}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Ошибка получения заказов", err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchOrders();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ p: 4 }}>
      {!user ? (
        <Typography variant="h6">Загрузка профиля...</Typography>
      ) : (
        <>
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
                <strong>Телефон:</strong> {user.phone || "-"}
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
          {orders.length === 0 ? (
            <Typography>У вас пока нет заказов.</Typography>
          ) : (
            orders.map((order) => (
              <Paper key={order.id} sx={{ p: 2, mb: 2 }}>
                <Typography>
                  <strong>Номер заказа:</strong> {order.id}
                </Typography>
                <Typography>
                  <strong>Статус:</strong> {order.status}
                </Typography>
                <Typography>
                  <strong>Сумма:</strong> {order.total} BYN
                </Typography>
                <Typography>
                  <strong>Дата:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>
                  <strong>Товары:</strong>
                </Typography>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product?.name || "—"} × {item.quantity} шт. —{" "}
                      {item.price} BYN
                    </li>
                  ))}
                </ul>
              </Paper>
            ))
          )}
        </>
      )}
    </Box>
  );
};

export default ProfilePage;
