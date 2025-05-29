import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Минск",
    password: "",
    confirmPassword: "",
    isLegal: false,
    acceptTerms: false,
    smsNotify: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
  
    if (!formData.acceptTerms) {
      alert("Необходимо принять условия оферты");
      return;
    }
  
    const [firstName, ...lastNameParts] = formData.fullName.trim().split(" ");
    const lastName = lastNameParts.join(" ");
  
    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: firstName || "",
      lastName: lastName || "",
      phone: formData.phone,
    };
  
    try {
      const response = await axiosInstance.post("/auth/register", payload);
      console.log("Успешно:", response.data);
      alert("Регистрация прошла успешно!");
      navigate("/login"); // ✅ редирект на страницу входа
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Ошибка:", error.response?.data || error.message);
        alert("Ошибка при регистрации");
      } else {
        console.error("Неизвестная ошибка:", error);
        alert("Произошла непредвиденная ошибка");
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fff", py: 4 }}>
      <Container maxWidth="sm">
        {/* Breadcrumbs */}
        <Box
          sx={{ display: "flex", alignItems: "center", mb: 3, color: "#888" }}
        >
          <HomeIcon fontSize="small" />
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Мой профиль
          </Link>
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Typography>Регистрация</Typography>
        </Box>

        {/* Heading */}
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Заявка на регистрацию
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Имя и Фамилия *"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Телефон *"
            name="phone"
            helperText="вводите +375 или +7"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="E-mail *"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Адрес"
            name="address"
            value={formData.address}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Город"
            name="city"
            value={formData.city}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Пароль *"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Подтверждение пароля *"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="isLegal"
                checked={formData.isLegal}
                onChange={handleChange}
              />
            }
            label="Юридическое лицо (Да/Нет)"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
            }
            label="Принимаю условия Оферты"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="smsNotify"
                checked={formData.smsNotify}
                onChange={handleChange}
              />
            }
            label="SMS рассылка"
          />

          <Button
            type="submit"
            variant="contained"
            color="warning"
            size="large"
            fullWidth
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            Зарегистрироваться
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
