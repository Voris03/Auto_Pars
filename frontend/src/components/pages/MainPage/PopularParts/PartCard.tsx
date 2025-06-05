import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { useCart } from "../../../../context/CartContext";

export interface Product {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: string;
  body: string;
  engine: string;
  modification: string;
  price: number;
  image?: string;
}

interface PartCardProps {
  product: Product;
  onClick: () => void;
}

const PartCard: React.FC<PartCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await addToCart(
        {
          id: product.id,
          name: product.title,
          price: product.price,
          brand: product.brand,
          image: product.image,
        },
        1
      );
    } catch (err) {
      console.error("Ошибка при добавлении в корзину", err);
    }
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 1.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 2,
        boxShadow: 2,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
        cursor: "pointer",
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={product.image || "/placeholder.png"}
        alt={product.title}
        sx={{ objectFit: "contain", mb: 1 }}
      />
      <CardContent sx={{ p: 1, flexGrow: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} noWrap>
          {product.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {product.brand}
        </Typography>
        <Typography variant="subtitle2" color="primary" mt={0.5}>
          {product.price.toLocaleString()} ₽
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 1, pt: 0 }}>
        <Button
          fullWidth
          size="small"
          variant="contained"
          color="warning"
          onClick={handleAddToCart}
        >
          В корзину
        </Button>
      </CardActions>
    </Card>
  );
};

export default PartCard;
