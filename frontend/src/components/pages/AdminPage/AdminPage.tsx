import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  List,
  ListItem,
  Button,
  Stack,
} from "@mui/material";

// Типы данных
interface User {
  id: number;
  email: string;
  role: "user" | "admin";
}

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  userId: number;
  date: string;
  total: number;
  items: OrderItem[];
}

interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
}

// Фейковые запросы
const fetchUsers = async (): Promise<User[]> => [
  { id: 1, email: "admin@example.com", role: "admin" },
  { id: 2, email: "user@example.com", role: "user" },
];

const fetchOrders = async (): Promise<Order[]> => [
  {
    id: 1,
    userId: 2,
    total: 320.5,
    date: "2025-05-10",
    items: [
      { title: "Тормозные колодки", price: 150, quantity: 1 },
      { title: "Масляный фильтр", price: 85, quantity: 2 },
    ],
  },
];

const fetchProducts = async (): Promise<Product[]> => [
  { id: 1, title: "Тормозные колодки", price: 150, brand: "BMW" },
  { id: 2, title: "Масляный фильтр", price: 85, brand: "Audi" },
];

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
    fetchOrders().then(setOrders);
    fetchProducts().then(setProducts);
  }, []);

  const toggleRole = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, role: user.role === "admin" ? "user" : "admin" }
          : user
      )
    );
  };

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <Box sx={{ px: 4, py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Панель администратора
      </Typography>

      <Grid container spacing={4}>
        {/* Пользователи */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Пользователи
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense disablePadding>
              {users.map((user) => (
                <ListItem
                  key={user.id}
                  sx={{
                    justifyContent: "space-between",
                    py: 1,
                    alignItems: "center",
                  }}
                >
                  <Box sx={{px: 4}}>
                    <Typography fontSize={14}>{user.email}</Typography>
                    <Typography
                      variant="caption"
                      color={user.role === "admin" ? "orange" : "gray"}
                      sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                    >
                      {user.role === "admin" ? "👑 Админ" : "👤 Пользователь"}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2}>
                    <Button
                      size="small"
                      color="warning"
                      variant="outlined"
                      onClick={() => toggleRole(user.id)}
                    >
                      Роль
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={() => removeUser(user.id)}
                    >
                      Удалить
                    </Button>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Заказы */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Заказы
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense disablePadding>
              {orders.map((order) => (
                <ListItem
                  key={order.id}
                  sx={{ display: "block", py: 1, mb: 2, borderBottom: "1px solid #eee" }}
                >
                  <Typography fontWeight="bold">
                    Заказ #{order.id} — {order.total} BYN
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    📅 {new Date(order.date).toLocaleDateString()} • 👤 ID: {order.userId}
                  </Typography>
                  <Box sx={{ mt: 1, pl: 1 }}>
                    {order.items.map((item, i) => (
                      <Typography variant="body2" key={i}>
                        • {item.title} — {item.price} BYN × {item.quantity}
                      </Typography>
                    ))}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Запчасти */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Запчасти
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense disablePadding>
              {products.map((prod) => (
                <ListItem
                  key={prod.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    borderBottom: "1px solid #eee",
                    py: 1,
                  }}
                >
                  <Typography fontWeight="bold">{prod.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {prod.price} BYN • Бренд: {prod.brand}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;