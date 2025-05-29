import React from 'react';
import BrandsGrid from './BrandsGrid';
import MainInfoSection from './MainInfoSection';
import TextBrandList from './TextBrandList';
import PopularPartsSection from './PopularParts/PopularPartsSection';


const MainPage = () => {
  return (
    <>
      {/* <HeroSlider /> */}
      <PopularPartsSection />
      <TextBrandList />
      <BrandsGrid />
      <MainInfoSection />
    </>
  );
};

export default MainPage;
