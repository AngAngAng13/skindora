import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const PublicLayout = lazy(() => import("@/layouts/publicLayout"));
const VerifyEmailPage = lazy(() => import("@/features/Auth/pages/VerifyEmail"));
const Adminpage = lazy(() => import("@/Adminpage"));
const AuthPage = lazy(() => import("@/features/Auth"));
const Homepage = lazy(() => import("@/features/Homepage"));
const ContactPage = lazy(() => import("@/features/Contact"));
const AboutPage = lazy(() => import("@/features/About"));
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
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
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
  {
    path: "/auth/verify-email",
    element: <VerifyEmailPage />,
  },
];
export default publicRoutes;
