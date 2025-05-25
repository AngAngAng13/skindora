import Hero from "@/features/Homepage/components/Hero";
import Topbar from "@/features/Homepage/components/Topbar";

import HighlightProducts from "./components/HighlightProducts";

export default function Homepage() {
  return (
    <>
      <Topbar
        branding="DMZ shop"
        navItems={[
          { displayText: "Home", path: "" },
          { displayText: "Products", path: "products" },
          { displayText: "About", path: "about" },
          { displayText: "Contact", path: "contact" },
        ]}
      />
      <Hero />
      <HighlightProducts />
    </>
  );
}
