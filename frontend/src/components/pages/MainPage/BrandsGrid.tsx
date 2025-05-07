import { Box, Grid, Typography } from "@mui/material";

const brands = [
  "acura", "alfa-romeo", "audi", "bmw", "buick", "byd", "cadillac", "chery", "chevrolet",
  "chrysler", "citroen", "dacia", "daewoo", "daihatsu", "datsun", "dodge", "fiat", "ford",
  "ford-usa", "gaz", "geely", "great-wall", "honda", "hummer", "hyundai", "infiniti", "isuzu",
  "jaguar", "jeep", "kia", "lada", "lancia", "land-rover", "lexus", "lifan", "mazda",
  "mercedes-benz", "mini", "mitsubishi", "moskvich", "nissan", "opel", "peugeot", "porsche",
  "renault", "rover", "saab", "seat", "skoda", "smart", "ssangyong", "subaru", "suzuki",
  "tesla", "toyota", "uaz", "volvo", "vw", "zaz"
];

const BrandsGrid = () => {
  return (
    <Box sx={{ px: 4, pb: 6 }}>
      <Grid container spacing={1} justifyContent="center">
        {brands.map((brand) => (
          <Grid
            key={brand}
            item
            xs={2}
            sm={1.5}
            md={1.2}
            sx={{
              textAlign: "center",
              border: "1px dashed #80bfff",
              borderRadius: 1,
              py: 2,
              px: 1,
            }}
          >
            <img
              src={`/icons/brands/${brand}.png`}
              alt={brand}
              style={{ height: 32, marginBottom: 4 }}
            />
            <Typography fontSize={12} color="text.secondary">
              {brand.toUpperCase()}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BrandsGrid;
