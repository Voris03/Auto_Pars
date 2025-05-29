import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

const LoginPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login", {
        email: emailOrPhone,
        password,
      });

      const { access_token, user } = res.data;

      login(access_token, user); // 👈 сохраняем токен + юзера
      navigate("/profile");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Ошибка авторизации");
      } else {
        alert("Непредвиденная ошибка входа");
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="sm">
        {/* Хлебные крошки */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, color: "#888" }}>
          <HomeIcon fontSize="small" />
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Typography component={Link} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
            Главная
          </Typography>
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Typography>Вход</Typography>
        </Box>

        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Вход в личный кабинет
        </Typography>

        {/* Форма */}
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            fullWidth
            label="E-mail / Телефон"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            type="password"
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "#f7941e", color: "#fff" }}
            >
              Войти
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ borderColor: "#f7941e", color: "#f7941e" }}
            >
              Забыли пароль?
            </Button>
          </Box>

          <Typography textAlign="center">
            Нет аккаунта?
            <Button
              component={Link}
              to="/register"
              sx={{ color: "#f7941e", fontWeight: "bold", ml: 1 }}
            >
              Зарегистрироваться
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;