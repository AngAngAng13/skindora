import type { RouteObject } from "react-router-dom";

import Homepage from "@/features/Homepage";
import Adminpage from "@/Adminpage";

const publicRoutes: RouteObject[] = [
  { index: true, path: "/", element: <Homepage /> },
  {
    index: true,
    path: "/admin",
    element: <Adminpage />,
  },
];
export default publicRoutes;
