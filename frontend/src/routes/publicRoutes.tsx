import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const PublicLayout = lazy(() => import("@/layouts/publicLayout"));

const Adminpage = lazy(() => import("@/Adminpage"));
const AuthPage = lazy(() => import("@/features/Auth"));
const Homepage = lazy(() => import("@/features/Homepage"));
const ProfilePage = lazy(() => import("@/features/Profile"));

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Homepage /> },
      {
        path: "admin",
        element: <Adminpage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
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
