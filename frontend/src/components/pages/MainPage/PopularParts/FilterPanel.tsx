import React from "react";
import { Box, Select, MenuItem } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

type Filters = Pick<Product, "year" | "brand" | "model" | "body" | "engine" | "modification">;

interface FilterPanelProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  products: Product[];
}

interface Product {
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

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  products,
}) => {
  const getUniqueOptions = (field: keyof Product) => {
    return Array.from(new Set(products.map((prod) => prod[field]))).filter(Boolean);
  };

  const handleChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box
      sx={{
        backgroundColor: "#25233D",
        p: 2,
        borderRadius: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
      }}
    >
      {(Object.keys(filters) as (keyof typeof filters)[]).map((field) => (
        <Select
          key={field}
          displayEmpty
          value={filters[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          sx={{ minWidth: 140, backgroundColor: "white", borderRadius: 1 }}
        >
          <MenuItem value="">
            {{
              year: "Год выпуска",
              brand: "Марка",
              model: "Модель",
              body: "Кузов",
              engine: "Двигатель",
              modification: "Модификация",
            }[field]}
          </MenuItem>
          {getUniqueOptions(field as keyof Product).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ))}
    </Box>
  );
};

export default FilterPanel;