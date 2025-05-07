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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DiscountIcon from "@mui/icons-material/Discount";
import WorkIcon from "@mui/icons-material/Work";
import { Link } from "react-router-dom";

const HeaderTop = () => {
  return (
    <Box sx={{ width: "100%", backgroundColor: "#26264f", color: "white" }}>
      {/* Верхняя панель */}
      <Box sx={{ px: 4, py: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack
            direction="row"
            spacing={3}
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "rgba(255,255,255,0.3)" }}
              />
            }
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <StorefrontIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">Обработка и выдача заказов</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CreditCardIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">Оплата</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <DiscountIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">Система скидок</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <WorkIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">Вакансии</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="body2" fontWeight="bold" color="error.main">
              A1
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              8 (044) <b>111-11-11</b>
            </Typography>
            <TelegramIcon sx={{ fontSize: 20 }} />
            <MuiLink href="#" underline="hover" sx={{ color: "white", fontSize: 14 }}>
              Перезвонить
            </MuiLink>
          </Stack>
        </Stack>
      </Box>

      {/* Линия-разделитель */}
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
              Выбрать авто
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <InputBase
              placeholder="Введите артикул или VIN-код"
              sx={{ flex: 1 }}
            />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Иконки */}
          <Stack direction="row" spacing={3} alignItems="center">
            <Link to="/favorites" style={{ textAlign: "center", color: "inherit", textDecoration: "none" }}>
              <Stack alignItems="center">
                <FavoriteBorderIcon />
                <Typography variant="caption">Избранное</Typography>
              </Stack>
            </Link>
            <Link to="/garage" style={{ textAlign: "center", color: "inherit", textDecoration: "none" }}>
              <Stack alignItems="center">
                <StorefrontIcon />
                <Typography variant="caption">Мое авто</Typography>
              </Stack>
            </Link>
            <Link to="/login" style={{ textAlign: "center", color: "inherit", textDecoration: "none" }}>
              <Stack alignItems="center">
                <PersonOutlineIcon />
                <Typography variant="caption">Войти</Typography>
              </Stack>
            </Link>
            <Link to="/cart" style={{ textAlign: "center", color: "inherit", textDecoration: "none" }}>
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