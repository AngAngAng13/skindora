import type { RouteObject } from "react-router-dom";

import Adminpage from "@/pages/Adminpage";
import Homepage from "@/pages/Homepage";

const publicRoutes: RouteObject[] = [
  { index: true, path: "/", element: <Homepage /> },
  {
    index: true,
    path: "/admin",
    element: <Adminpage />,
  },
];
export default publicRoutes;
