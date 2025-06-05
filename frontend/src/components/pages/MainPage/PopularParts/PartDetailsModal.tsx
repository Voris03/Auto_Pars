import React from "react";
import { Modal, Box, Typography, Button, Divider } from "@mui/material";
import type { Product } from "./PartCard";

interface PartDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const PartDetailsModal: React.FC<PartDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const {
    title,
    brand,
    model,
    year,
    body,
    engine,
    modification,
    price,
    image,
  } = product;

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>

        <Box
          component="img"
          src={image || "/placeholder.png"}
          alt={title}
          sx={{
            width: "100%",
            height: 180,
            objectFit: "contain",
            mb: 2,
            borderRadius: 1,
            backgroundColor: "#f5f5f5",
          }}
        />

        <Divider sx={{ mb: 2 }} />

        <Box display="grid" gap={1} mb={2}>
          <Detail label="Бренд" value={brand} />
          <Detail label="Модель" value={model} />
          <Detail label="Год выпуска" value={year} />
          <Detail label="Кузов" value={body} />
          <Detail label="Двигатель" value={engine} />
          <Detail label="Модификация" value={modification} />
        </Box>

        <Typography variant="h6" color="primary" mb={2}>
          {price.toLocaleString()} ₽
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="warning"
          onClick={() => {
            onAddToCart(product);
            onClose();
          }}
        >
          Добавить в корзину
        </Button>
      </Box>
    </Modal>
  );
};

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Typography variant="body2">
    <strong>{label}:</strong> {value}
  </Typography>
);

export default PartDetailsModal;