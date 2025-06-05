import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import ManageCustomer from "@/Adminpage";
import Admin from "@/features/Admin";

const PublicLayout = lazy(() => import("@/layouts/publicLayout"));

const Adminpage = lazy(() => import("@/Adminpage"));
const AuthPage = lazy(() => import("@/features/Auth"));
const Homepage = lazy(() => import("@/features/Homepage"));
const ProfilePage = lazy(() => import("@/features/Profile"));

// import AuthPage from "@/features/Auth";
// import Homepage from "@/features/Homepage";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Homepage /> },
      // {
      //   path: "admin",
      //   element: <Adminpage />,
      // },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  { index: true, path: "/", element: <Homepage /> },
  // {
  //   index: true,
  //   path: "/admin",
  //   element: <Admin />,
  // },
  // {
  //   index: true,
  //   path: "/customers",
  //   element: <ManageCustomer />,
  // },
  {
    path: "auth",
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
