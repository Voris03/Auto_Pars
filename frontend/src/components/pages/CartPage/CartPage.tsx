// src/components/pages/CartPage/CartPage.tsx

import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const CartPage = () => {
  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Корзина
      </Typography>

      <Grid container spacing={4} justifyContent="center" my={4}>
        <Grid item xs={12} md={3} textAlign="center">
          <Box>
            <ShoppingCartIcon sx={{ fontSize: 60, color: "#ccc" }} />
            <Typography>Перейти в магазин для заказа</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} textAlign="center">
          <Box>
            <StorefrontIcon sx={{ fontSize: 60, color: "#ccc" }} />
            <Typography>Перейти в каталог для подбора</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} textAlign="center">
          <Box>
            <PersonOutlineIcon sx={{ fontSize: 60, color: "#ccc" }} />
            <Typography>Перейти в личный кабинет</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;