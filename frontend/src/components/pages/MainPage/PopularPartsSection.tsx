import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  MenuItem,
  Select,
  Button,
  Grid,
} from '@mui/material';

const PopularPartsSection = () => {
  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState({
    year: '',
    brand: '',
    model: '',
    body: '',
    engine: '',
    modification: '',
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const categories = [
    { label: 'Фильтры', img: '/icons/filters.png' },
    { label: 'Тормозная система', img: '/icons/brakes.png' },
    { label: 'Зажигание', img: '/icons/ignition.png' },
    { label: 'Подвеска', img: '/icons/suspension.png' },
    { label: 'Ремни, цепи и натяжители', img: '/icons/belts.png' },
    { label: 'Рулевое управление', img: '/icons/steering.png' },
    { label: 'Охлаждение', img: '/icons/cooling.png' },
    { label: 'Система выпуска', img: '/icons/exhaust.png' },
    { label: 'Топливная система', img: '/icons/fuel.png' },
    { label: 'Сцепление', img: '/icons/clutch.png' },
  ];

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Популярные категории запчастей
      </Typography>
      <Typography variant="body2" color="gray" mb={2}>
        Выбор автомобиля позволяет отобразить только те запчасти, которые подходят к вашему автомобилю
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ backgroundColor: '#f5f6f8', borderRadius: 1, mb: 2 }}
      >
        <Tab label="По авто" />
        <Tab label="По номеру запчасти" />
      </Tabs>

      {tab === 0 && (
        <Box
          sx={{
            backgroundColor: '#25233D',
            p: 2,
            borderRadius: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          {['year', 'brand', 'model', 'body', 'engine', 'modification'].map((field) => (
            <Select
              key={field}
              displayEmpty
              value={filters[field as keyof typeof filters]}
              onChange={(e) => handleFilterChange(field, e.target.value)}
              sx={{ minWidth: 120, backgroundColor: 'white', borderRadius: 1 }}
            >
              <MenuItem value="">
                {field === 'year' && 'Год выпуска'}
                {field === 'brand' && 'Марка'}
                {field === 'model' && 'Модель'}
                {field === 'body' && 'Кузов'}
                {field === 'engine' && 'Двигатель'}
                {field === 'modification' && 'Модификация'}
              </MenuItem>
              <MenuItem value="sample">Пример</MenuItem>
            </Select>
          ))}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: 'white' }}>
            <Typography fontSize={14}>🚗 Мои авто</Typography>
            <Typography fontSize={14}>Все марки</Typography>
          </Box>
        </Box>
      )}

      <Typography variant="h6" fontWeight="bold" mb={2}>
        Автозапчасти
      </Typography>

      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid item xs={6} sm={3} md={2} key={cat.label} textAlign="center">
            <Box
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                backgroundColor: '#f5f6f8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <img src={cat.img} alt={cat.label} width="100%" height="100%" />
            </Box>
            <Typography fontSize={14}>{cat.label}</Typography>
          </Grid>
        ))}
      </Grid>

      <Box mt={2}>
        <Button variant="text" size="small">Смотреть все →</Button>
      </Box>
    </Box>
  );
};

export default PopularPartsSection;
