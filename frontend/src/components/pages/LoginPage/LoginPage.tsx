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
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";

const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: emailOrPhone,
        password,
      });

      const token = response.data.access_token;
      await login(token);

      alert("Успешный вход!");
      navigate("/profile");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Ошибка авторизации");
      } else {
        alert("Непредвиденная ошибка");
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="sm">
        {/* Breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, color: "#888" }}>
          <HomeIcon fontSize="small" />
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Typography
            component={Link}
            to="/profile"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            Мой профиль
          </Typography>
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Typography>Вход</Typography>
        </Box>

        {/* Heading */}
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Личный кабинет
        </Typography>

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          autoComplete="off"
        >
          <TextField
            fullWidth
            label="Логин / E-mail / Телефон"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "#f7941e", color: "#fff" }}
            >
              Войти
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderColor: "#f7941e", color: "#f7941e" }}
            >
              Забыли пароль?
            </Button>
          </Box>

          <Typography textAlign="center" mt={2}>
            Нет аккаунта?
            <Button
              component={Link}
              to="/register"
              variant="text"
              sx={{ ml: 1, color: "#f7941e", fontWeight: "bold" }}
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