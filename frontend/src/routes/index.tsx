import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import NotFoundPage from "@/features/ErrorPage/404";
import RootLayout from "@/layouts/RootLayout";

import privateRoutes from "./adminRoutes";
import protectedRoutes from "./protectedRoutes";
import publicRoutes from "./publicRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      ...privateRoutes,
      {
        element: <ProtectedRoute />,
        children: [...protectedRoutes],
      },
    ],
    errorElement: <NotFoundPage />,
  },
]);
export default router;
