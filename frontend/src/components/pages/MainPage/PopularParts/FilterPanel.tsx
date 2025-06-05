import React from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

type Filters = Pick<
  Product,
  "year" | "brand" | "model" | "body" | "engine" | "modification"
>;

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

const fieldLabels: Record<keyof Filters, string> = {
  year: "Год выпуска",
  brand: "Марка",
  model: "Модель",
  body: "Кузов",
  engine: "Двигатель",
  modification: "Модификация",
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  products,
}) => {
  const getUniqueOptions = (field: keyof Product): string[] => {
    return Array.from(
      new Set(
        products
          .map((p) => p[field])
          .filter((val): val is string => typeof val === "string")
      )
    ).sort();
  };

  const handleChange = (field: keyof Filters, event: SelectChangeEvent) => {
    const value = event.target.value;
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
      {(Object.keys(filters) as (keyof Filters)[]).map((field) => (
        <FormControl
          key={field}
          sx={{ minWidth: 140, backgroundColor: "white", borderRadius: 1 }}
          size="small"
        >
          <InputLabel>{fieldLabels[field]}</InputLabel>
          <Select
            value={filters[field]}
            onChange={(e) => handleChange(field, e)}
            displayEmpty
            label={fieldLabels[field]}
            renderValue={(value) =>
              value ? (
                value
              ) : (
                <span style={{ color: "#aaa" }}>{fieldLabels[field]}</span>
              )
            }
          >
            <MenuItem value="">
              <em>{fieldLabels[field]}</em>
            </MenuItem>
            {getUniqueOptions(field).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
};

export default FilterPanel;
