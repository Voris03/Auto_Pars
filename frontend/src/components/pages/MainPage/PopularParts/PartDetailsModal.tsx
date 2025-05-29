import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
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

  return (
    <Modal open={!!product} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "90%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {product.title}
        </Typography>
        <img src={product.image || "/placeholder.png"} alt={product.title} />
        <Typography variant="body2">
          <strong>Бренд:</strong> {product.brand}
        </Typography>
        <Typography variant="body2">
          <strong>Модель:</strong> {product.model}
        </Typography>
        <Typography variant="body2">
          <strong>Год:</strong> {product.year}
        </Typography>
        <Typography variant="body2">
          <strong>Кузов:</strong> {product.body}
        </Typography>
        <Typography variant="body2">
          <strong>Двигатель:</strong> {product.engine}
        </Typography>
        <Typography variant="body2">
          <strong>Модификация:</strong> {product.modification}
        </Typography>
        <Typography variant="h6" color="primary" mt={2}>
          {product.price} RUB
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="warning"
          sx={{ mt: 2 }}
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

export default PartDetailsModal;
