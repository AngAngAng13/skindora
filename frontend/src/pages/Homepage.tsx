import React from "react";

import Topbar from "@/components/Topbar";

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
      <h1 className="prose">hello world</h1>
    </>
  );
}
