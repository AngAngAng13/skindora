import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
const CheckoutPage = lazy(() => import("@/features/Checkout"));
import PublicLayout from "@/layouts/publicLayout";
const CartPage = lazy(() => import("@/features/Cart"));
const ProfilePage = lazy(() => import("@/features/Profile"));
const TrackOrderPage = lazy(() => import("@/features/OrderTracking"));
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "orders/tracking/:orderId",
        element: <TrackOrderPage />,
      },
      
    ],
  },
];

export default protectedRoutes;
