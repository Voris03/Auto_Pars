import React, { useState } from "react";
import {
  Box,
  Typography,
  Link as MuiLink,
  Stack,
  IconButton,
  InputBase,
  Divider,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // путь проверь

const HeaderTop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Box sx={{ width: "100%", backgroundColor: "#26264f", color: "white" }}>
      {/* Верхняя панель */}
      <Box sx={{ px: 4, py: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">Сервис автозапчастей</Typography>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="body2" fontWeight="bold" color="error.main">A1</Typography>
            <Typography variant="body2" fontWeight="bold">8 (044) <b>111-11-11</b></Typography>
            <TelegramIcon sx={{ fontSize: 20 }} />
            <MuiLink href="#" underline="hover" sx={{ color: "white", fontSize: 14 }}>Перезвонить</MuiLink>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

      {/* Нижняя панель */}
      <Box sx={{ px: 4, py: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* Логотип */}
          <Link to="/">
            <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 40 }} />
          </Link>

          {/* Поиск */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 1,
              width: "100%",
              maxWidth: 600,
              px: 1.5,
              py: 0.5,
            }}
          >
            <Typography variant="body2" sx={{ mr: 2 }}>
              Поиск
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <InputBase
              placeholder="Введите артикул или VIN-код"
              sx={{ flex: 1 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />
            <IconButton onClick={handleSearchSubmit}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Иконки */}
          <Stack direction="row" spacing={3} alignItems="center">
            <Link
              to={user ? "/profile" : "/login"}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Stack alignItems="center">
                <PersonOutlineIcon />
                <Typography variant="caption">
                  {user ? `${user.firstName}` : "Мой Профиль"}
                </Typography>
              </Stack>
            </Link>
            <Link to="/cart" style={{ color: "inherit", textDecoration: "none" }}>
              <Stack alignItems="center">
                <Badge badgeContent={0} color="warning">
                  <LocalMallOutlinedIcon />
                </Badge>
                <Typography variant="caption">Корзина</Typography>
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default HeaderTop;