import React from 'react';
import HeroSlider from './HeroSlider';
import PopularPartsSection from './PopularPartsSection';
import BrandsGrid from './BrandsGrid';
import MainInfoSection from './MainInfoSection';
import TextBrandList from './TextBrandList';


const MainPage = () => {
  return (
    <>
      <HeroSlider />
      <PopularPartsSection />
      <TextBrandList />
      <BrandsGrid />
      <MainInfoSection />
    </>
  );
};

export default MainPage;
