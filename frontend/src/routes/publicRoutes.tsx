import type { RouteObject } from "react-router-dom";

import Admin from "@/features/Admin";
import ManageCustomer from "@/features/Admin/ManageCustomer";
import Homepage from "@/features/Homepage";

const publicRoutes: RouteObject[] = [
  { index: true, path: "/", element: <Homepage /> },
  {
    index: true,
    path: "/admin",
    element: <Admin />,
  },
  {
    index: true,
    path: "/customers",
    element: <ManageCustomer />,
  },
];
export default publicRoutes;
