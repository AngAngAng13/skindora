import type { RouteObject } from "react-router-dom";

import Adminpage from "@/Adminpage";
import AuthPage from "@/features/Auth";
import Homepage from "@/features/Homepage";

const publicRoutes: RouteObject[] = [
  { index: true, path: "/", element: <Homepage /> },
  {
    index: true,
    path: "/admin",
    element: <Adminpage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    children: [
      {
        index: true,
        path: "login",
        element: null,
      },
      {
        path: "register",
        element: null,
      },
    ],
  },
];
export default publicRoutes;
