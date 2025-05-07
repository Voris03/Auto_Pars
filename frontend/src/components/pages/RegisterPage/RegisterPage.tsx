import React from "react";
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

const RegisterPage = () => {
  return (
    <Box sx={{ backgroundColor: "#fff", py: 4 }}>
      <Container maxWidth="sm">
        {/* Breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, color: "#888" }}>
          <HomeIcon fontSize="small" />
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
            Мой профиль
          </Link>
          <ArrowForwardIosIcon sx={{ fontSize: 12, mx: 1 }} />
          <Typography>Регистрация</Typography>
        </Box>

        {/* Heading */}
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
        >
          Заявка на регистрацию
        </Typography>

        {/* Registration Form */}
        <Box component="form" noValidate autoComplete="off">
          <TextField fullWidth label="Имя и Фамилия *" variant="outlined" sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Телефон *"
            variant="outlined"
            helperText="вводите +375 или +7"
            sx={{ mb: 2 }}
          />
          <TextField fullWidth label="E-mail *" variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Адрес" variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Минск" variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Пароль *" variant="outlined" type="password" sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Подтверждение пароля *"
            variant="outlined"
            type="password"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={<Checkbox />}
            label="Юридическое лицо (Да/Нет)"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Принимаю условия Оферты"
          />
          <FormControlLabel control={<Checkbox />} label="SMS рассылка" />


          <Button
            variant="contained"
            color="warning"
            size="large"
            fullWidth
            sx={{ fontWeight: "bold" }}
          >
            Зарегистрироваться
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
