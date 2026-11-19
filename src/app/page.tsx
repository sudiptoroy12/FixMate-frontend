import { Suspense } from "react";
import FeaturedServices from "./components/home/FeaturedServices";
import HeroBanner from "./components/home/HeroBanner";
import HowFixMateWorks from "./components/home/HowFixMateWorks";
import PopularCategories from "./components/home/PopularCategories";


export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <Suspense fallback={<div>Loading....</div>}>
         <FeaturedServices/>
      </Suspense>
      <HowFixMateWorks/>
      <PopularCategories/>
     

    </>
  );
}