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

// Тип данных для отображаемого продукта
export interface Product {
  id: number; // можно оставить для клиента
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

// Пропсы карточки
interface PartCardProps {
  product: Product;
  onClick: () => void;
}

const PartCard: React.FC<PartCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      await addToCart(
        {
          name: product.title,
          price: product.price,
          brand: product.brand,
          image: product.image,
        },
        1
      );
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину", error);
    }
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <CardMedia
        component="img"
        height="100"
        image={product.image || "/placeholder.png"}
        alt={product.title}
        sx={{ objectFit: "contain", mb: 1 }}
      />
      <CardContent sx={{ p: 1 }}>
        <Typography variant="body2" fontWeight="bold" noWrap>
          {product.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {product.brand}
        </Typography>
        <Typography variant="subtitle2" color="primary" mt={1}>
          {product.price} RUB
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          size="small"
          variant="outlined"
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