import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";

const slides = [
  "/slider/slide1.svg",
  "/slider/slide2.svg",
  // Добавь свои изображения сюда
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handleBack = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <SwipeableViews index={index} onChangeIndex={setIndex} enableMouseEvents>
        {slides.map((src, idx) => (
          <Box
            key={idx}
            component="img"
            src={src}
            alt={`slide-${idx}`}
            sx={{
              width: "100%",
              height: "420px",
              objectFit: "cover",
              display: "block",
              userSelect: "none",
            }}
          />
        ))}
      </SwipeableViews>

      <IconButton
        onClick={handleBack}
        sx={{
          position: "absolute",
          top: "50%",
          left: 12,
          transform: "translateY(-50%)",
          backgroundColor: "#fff",
          zIndex: 2,
          "&:hover": { backgroundColor: "#eee" },
        }}
      >
        <ArrowBackIos fontSize="small" />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 12,
          transform: "translateY(-50%)",
          backgroundColor: "#fff",
          zIndex: 2,
          "&:hover": { backgroundColor: "#eee" },
        }}
      >
        <ArrowForwardIos fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default HeroSlider;
