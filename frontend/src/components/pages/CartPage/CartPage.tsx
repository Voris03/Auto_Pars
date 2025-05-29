import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Modal,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useCart } from "../../../context/CartContext";
import axios from "../../../api/axiosInstance";

const CartPage: React.FC = () => {
  const { items, total, removeFromCart, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const handleOrderSubmit = async () => {
    try {
      const shippingAddress =
        deliveryType === "pickup"
          ? "Самовывоз, магазин на месте"
          : "ул. Примерная, д. 1, кв. 1"; // 📝 замените на пользовательский ввод при необходимости

      const payload = {
        shippingAddress,
        deliveryType,
        paymentMethod,
        cardInfo:
          paymentMethod === "card"
            ? {
                number: cardNumber,
                date: cardDate,
                cvv: cardCvv,
              }
            : undefined,
      };

      await axios.post("/orders", payload);

      alert("Заказ успешно оформлен!");
      clearCart();
      setOpen(false);
    } catch (err) {
      console.error("Ошибка оформления заказа", err);
      alert("Ошибка оформления заказа");
    }
  };

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Корзина
      </Typography>

      {items.length === 0 ? (
        <Typography>Корзина пуста</Typography>
      ) : (
        <>
          <Grid container spacing={2} mt={2}>
            {items.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.productImage || "/placeholder.png"}
                    alt={item.productName || "Товар"}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.productName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Бренд: {item.productBrand || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      Цена: {item.price} RUB × {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      Всего: {(item.price * item.quantity).toFixed(2)} RUB
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Удалить
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box mt={4}>
            <Typography variant="h6">Итого: {total.toFixed(2)} RUB</Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="outlined" onClick={clearCart}>
                Очистить корзину
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                Оформить заказ
              </Button>
            </Stack>
          </Box>
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            width: 400,
            mx: "auto",
            mt: "10%",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Оформление заказа
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Способ доставки
          </Typography>
          <RadioGroup
            row
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
          >
            <FormControlLabel
              value="pickup"
              control={<Radio />}
              label="Самовывоз"
            />
            <FormControlLabel
              value="delivery"
              control={<Radio />}
              label="Доставка"
            />
          </RadioGroup>

          {deliveryType === "delivery" && (
            <TextField
              fullWidth
              label="Адрес доставки"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Способ оплаты
          </Typography>
          <RadioGroup
            row
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label="Наличные"
            />
            <FormControlLabel value="card" control={<Radio />} label="Карта" />
          </RadioGroup>

          {paymentMethod === "card" && (
            <Stack spacing={2} mt={2}>
              <TextField
                fullWidth
                label="Номер карты"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <TextField
                fullWidth
                label="Срок действия"
                value={cardDate}
                onChange={(e) => setCardDate(e.target.value)}
              />
              <TextField
                fullWidth
                label="CVV"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
              />
            </Stack>
          )}

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleOrderSubmit}
          >
            Подтвердить заказ
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CartPage;
