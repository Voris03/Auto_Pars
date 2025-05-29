import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import PartCard, { type Product } from "./PartCard";
import PartDetailsModal from "./PartDetailsModal";
import FilterPanel from "./FilterPanel";
import { getAllProducts } from "../../../../services/productsService";
import { useCart } from "../../../../context/CartContext";

const ITEMS_PER_PAGE = 25;

const PopularPartsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<
    Pick<
      Product,
      "year" | "brand" | "model" | "body" | "engine" | "modification"
    >
  >({
    year: "",
    brand: "",
    model: "",
    body: "",
    engine: "",
    modification: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    getAllProducts().then(setProducts).catch(console.error);
  }, []);

  const handleAddToCart = async (product: Product) => {
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
      setSnackOpen(true);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину", error);
    }
  };

  const filteredProducts = products.filter((prod) =>
    Object.entries(filters).every(
      ([key, value]) => !value || prod[key as keyof Product] === value
    )
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Популярные категории запчастей
      </Typography>

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        products={products}
      />

      <Grid container spacing={2}>
        {paginatedProducts.map((prod) => (
          <Grid item xs={6} sm={4} md={2.4} key={prod.id}>
            <PartCard product={prod} onClick={() => setSelectedProduct(prod)} />
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <PartDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Товар добавлен в корзину
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PopularPartsSection;
