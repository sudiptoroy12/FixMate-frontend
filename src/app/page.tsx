import { Suspense } from "react";
import FeaturedServices from "./components/home/FeaturedServices";
import HeroBanner from "./components/home/HeroBanner";
import HowFixMateWorks from "./components/home/HowFixMateWorks";
import PopularCategories from "./components/home/PopularCategories";
import Navbar from "./components/shared/navbar/Navbar";


export default function HomePage() {
  return (
    <>
     <Suspense fallback={<div className="h-24" />}>
            <Navbar />
          </Suspense>

      <HeroBanner />
      <Suspense fallback={<div>Loading....</div>}>
         <FeaturedServices/>
      </Suspense>
      <HowFixMateWorks/>
      <PopularCategories/>
     

    </>
  );
}