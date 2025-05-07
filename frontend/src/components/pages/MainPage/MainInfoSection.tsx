// src/components/MainPage/MainInfoSection.tsx
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import { useState } from "react";

const MainInfoSection = () => {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setTab(newValue);

  return (
    <Box display="flex" gap={4} px={6} py={6}>
      {/* Левая колонка */}
      <Box width="30%">
        <Typography variant="h5" fontWeight="bold" mb={2}>Категории</Typography>
        <Typography color="text.secondary" mb={3}>Тормозные колодки и сигнализаторы</Typography>
        <Typography color="text.secondary">Горячее предложение для авто</Typography>

        <Typography variant="h6" fontWeight="bold" mt={6} mb={2}>Новости и статьи</Typography>
        <Box mb={2}>
          <Typography fontSize={14} mb={0.5}>
            Время работы интернет-магазина 7 и 8 ноября 2024!
          </Typography>
          <Typography variant="caption" color="text.secondary">05 ноябрь</Typography>
        </Box>
        <Box>
          <Typography fontSize={14} mb={0.5}>
            Как я менял задний ступичный подшипник на Ладе Гранта
          </Typography>
          <Typography variant="caption" color="text.secondary">27 ноябрь</Typography>
        </Box>
        <Typography mt={2} color="primary" fontSize={14}>Все новости и статьи →</Typography>
      </Box>

      {/* Правая колонка */}
      <Box width="70%">
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Интернет-магазин автозапчастей в Минске, Гомеле, Гродно и Могилеве
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} textColor="primary">
          <Tab label="Преимущества" />
          <Tab label="Оформление заказа" />
          <Tab label="Навигация по сайту" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />

        {/* Контент по табам */}
        {tab === 0 && (
          <Box>
            <Typography fontSize={14} mb={1}>
              10 причин, почему стоит купить автозапчасти в Минске в интернет-магазине autoostrov.by
            </Typography>
            <Typography fontSize={14} mb={1}>
              <b>1. Цена.</b> Один из ключевых параметров...
            </Typography>
            <Typography fontSize={14} mb={1}>
              <b>2. Простой и интуитивно</b> понятный каталог товаров...
            </Typography>
            <Typography fontSize={14}>
              <b>3. Доставка.</b> Зона доставки довольно обширна...
            </Typography>
          </Box>
        )}
        {/* Можно добавить другие tab-контенты */}
      </Box>
    </Box>
  );
};

export default MainInfoSection;