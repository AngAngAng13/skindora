import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import Admin from "@/features/Admin";

// import ManageCustomer from "@/features/Admin/ManageCustomer";
const AdminLayout = lazy(() => import("@/layouts/adminLayout"));
const ManageProducts = lazy(() => import("@/features/Admin/ManageProduct"));
const ManageUsers = lazy(() => import("@/features/Admin/ManageCustomer"));
const ManageProductsPage = lazy(() => import("@/features/Admin/ManageProduct"));
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
    ],
  },
];
export default adminRoutes;
