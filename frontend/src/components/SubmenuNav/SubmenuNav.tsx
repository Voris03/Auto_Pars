import { Box, Typography } from "@mui/material";

const SubmenuNav = () => {
  return (
    <Box sx={{ backgroundColor: "#F4F5F7", borderBottom: "1px solid #E0E0E0" }}>
      <Box
        sx={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="/icons/search.svg"
            alt="Каталог товаров"
            width={20}
            height={20}
            style={{ opacity: 0.3 }}
          />
          <Typography
            fontSize={12}
            color="#000"
            sx={{ fontWeight: 400, opacity: 0.9 }}
          >
            Каталог товаров
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="/icons/car.svg"
            alt="Каталог по маркам"
            width={20}
            height={20}
            style={{ opacity: 0.3 }}
          />
          <Typography
            fontSize={12}
            color="#000"
            sx={{ fontWeight: 400, opacity: 0.9 }}
          >
            Каталог по маркам
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SubmenuNav;
