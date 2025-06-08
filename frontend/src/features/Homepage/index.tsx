import Hero from "@/features/Homepage/components/Hero";

import HighlightCatagories from "./components/HighlightCatagories";
import HighlightProducts from "./components/HighlightProducts";
import Footer from "./components/Footer";
export default function Homepage() {
  return (
    <>
      <Hero />
      <HighlightProducts />
      <HighlightCatagories />
      <Footer />
    </>
  );
}
