import { Box, Typography } from "@mui/material";

const brands = [
  "NGK", "BILSTEIN", "VALEO", "BOSCH", "SACHS", "KNECHT", "MONROE",
  "PURFLUX", "DAYCO", "SKF", "BREMBO", "DENSO", "KYB", "FEBI BILSTEIN",
  "SNR", "OPTIMAL", "CORTECO", "REMSA", "ICER", "FILTRON", "TRW",
  "SWAG", "FAG", "INA", "GATES", "LUCAS", "PATRON", "STELLOX", "FEBEST"
];

const TextBrandList = () => {
  return (
    <Box sx={{ px: 6, py: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Бренды
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          color: "text.secondary",
          fontWeight: 500,
        }}
      >
        {brands.map((brand) => (
          <Typography key={brand}>{brand}</Typography>
        ))}
      </Box>
    </Box>
  );
};

export default TextBrandList;