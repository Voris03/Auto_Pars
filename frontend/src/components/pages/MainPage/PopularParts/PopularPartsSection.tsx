import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import PartCard from "./PartCard";
import PartDetailsModal from "./PartDetailsModal";
import FilterPanel from "./FilterPanel";
import { getAllProducts } from "../../../../services/productsService";
import { useCart } from "../../../../context/CartContext";
import type { Product } from "../../../../types/Product"; // убедись, что путь правильный

const ITEMS_PER_PAGE = 12;

const PopularPartsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: "",
    body: "",
    engine: "",
    modification: "",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      const { items, totalPages } = await getAllProducts({
        page,
        limit: ITEMS_PER_PAGE,
        filters,
      });
      setProducts(items as Product[]);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Ошибка загрузки продуктов:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          brand: product.brand,
          image: product.images?.[0] || "/placeholder.png",
        },
        1
      );
      setSnackOpen(true);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину", error);
    }
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Популярные запчасти
      </Typography>

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        products={products}
      />

      <Grid container spacing={2} mt={2}>
        {products.map((prod) => (
          <Grid item xs={6} sm={4} md={3} key={prod.id}>
            <PartCard
              product={{
                id: prod.id,
                title: prod.name,
                brand: prod.brand,
                price: Number(prod.price),
                image: prod.images?.[0] || "/placeholder.png",
                model: prod.specifications?.model || "",
                year: prod.specifications?.year || "",
                engine: prod.specifications?.engine || "",
                body: prod.specifications?.body || "",
                modification: prod.specifications?.modification || "",
              }}
              onClick={() => setSelectedProduct(prod)}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
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