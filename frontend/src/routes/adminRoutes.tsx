import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import Admin from "@/features/Admin";

// import ManageCustomer from "@/features/Admin/ManageCustomer";
const AdminLayout = lazy(() => import("@/layouts/adminLayout"));
const ManageProducts = lazy(() => import("@/features/Admin/ManageProduct"));
const ManageUsers = lazy(() => import("@/features/Admin/ManageCustomer"));
const ManageOrders = lazy(() => import("@/features/Admin/ManageOrders"));
const ManageStatics = lazy(() => import("@/features/Admin/ManageStatics"));
// const Admin = lazy(() => import("@/features/Admin"));
const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Admin /> },
      {
        path: "customers",
        element: <ManageUsers />,
      },
      {
        path: "products",
        element: <ManageProducts />,
      },
      {
        path: "orders",
        element: <ManageOrders />,
      },
      {
        path: "statics",
        element: <ManageStatics />,
      },
    ],
  },
];
export default adminRoutes;
