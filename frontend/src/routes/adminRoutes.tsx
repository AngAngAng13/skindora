import type { RouteObject } from "react-router-dom";

import Admin from "@/features/Admin";
import ManageBrand from "@/features/Admin/ManageBrand";
import ManageUsers from "@/features/Admin/ManageCustomer";
import ManageOrders from "@/features/Admin/ManageOrders";
import ManageOrigin from "@/features/Admin/ManageOrigin";
import ManageProducts from "@/features/Admin/ManageProduct";
import ManageSkin from "@/features/Admin/ManageSkin";
import ManageStatics from "@/features/Admin/ManageStatics";
import ManageUse from "@/features/Admin/ManageUse";
import ManageVoucher from "@/features/Admin/ManageVoucher";
import ProfileAdmin from "@/features/Admin/ProfileAdmin";
import AddProductPage from "@/features/Admin/components/AddProduct";
import AdminLayout from "@/layouts/adminLayout";

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
        path: "brand",
        element: <ManageBrand />,
      },
      {
        path: "typeskin",
        element: <ManageSkin />,
      },
      {
        path: "use",
        element: <ManageUse />,
      },
      {
        path: "origin",
        element: <ManageOrigin />,
      },
      {
        path: "voucher",
        element: <ManageVoucher />,
      },
      {
        path: "createProduct",
        element: <AddProductPage />,
      },
      {
        path: "orders",
        element: <ManageOrders />,
      },
      {
        path: "profile",
        element: <ProfileAdmin />,
      },
      {
        path: "statics",
        element: <ManageStatics />,
      },
    ],
  },
];

export default adminRoutes;
