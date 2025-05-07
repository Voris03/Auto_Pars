import React from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="sm">
        {/* Breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, color: "#888" }}>
          <HomeIcon fontSize="small" />
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Typography component={Link} to="/profile" sx={{ textDecoration: "none", color: "inherit" }}>
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
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Логин / E-mail / Телефон"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" fullWidth sx={{ backgroundColor: '#f7941e', color: '#fff' }}>
              Войти
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderColor: '#f7941e', color: '#f7941e' }}
            >
              Забыли пароль?
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
