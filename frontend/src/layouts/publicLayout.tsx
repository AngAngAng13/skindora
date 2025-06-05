import { Outlet } from "react-router-dom";
import Topbar from "@/features/Homepage/components/Topbar";
const PublicLayout = () => {
  return (
    <>
      <Topbar
        branding="Skindora"
        navItems={[
          { displayText: "Home", path: "" },
          { displayText: "Products", path: "products" },
          { displayText: "About", path: "about" },
          { displayText: "Contact", path: "contact" },
        ]}
      />
      <Outlet />
    </>
  );
};
export default PublicLayout;
