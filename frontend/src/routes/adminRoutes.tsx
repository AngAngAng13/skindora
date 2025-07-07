import type { RouteObject } from "react-router-dom";

import Admin from "@/features/Admin";
import AddVoucherPage from "@/features/Admin/AddVoucherPage";
import ManageBrand from "@/features/Admin/ManageBrand";
import ManageUsers from "@/features/Admin/ManageCustomer";
import ManageOrders from "@/features/Admin/ManageOrders";
import ManageOrigin from "@/features/Admin/ManageOrigin";
import ManageProducts from "@/features/Admin/ManageProduct";
import ManageSkin from "@/features/Admin/ManageSkin";
import ManageStatics from "@/features/Admin/ManageStatics";
import ManageUse from "@/features/Admin/ManageUse";
import ManageVoucher from "@/features/Admin/ManageVoucher";
import OrderDetailPage from "@/features/Admin/OrderDetailPage";
import ProductDetail from "@/features/Admin/ProductDetail";
import ProfileAdmin from "@/features/Admin/ProfileAdmin";
import UpdateDetailProduct from "@/features/Admin/UpdateDetail";
import UpdateVoucher from "@/features/Admin/UpdateVoucher";
import VoucherDetail from "@/features/Admin/VoucherDetail";
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
        path: ":id/detail",
        element: <ProductDetail />,
      },
      {
        path: ":id/update-product",
        element: <UpdateDetailProduct />,
      },
      {
        path: "products",
        element: <ManageProducts />,
      },
      {
        path: "createProduct",
        element: <AddProductPage />,
      },
      {
        path: "createVoucher",
        element: <AddVoucherPage />,
      },
      {
        path: "update-voucher/:voucherId",
        element: <UpdateVoucher />,
      },
      {
        path: "orders",
        element: <ManageOrders />,
      },
      {
        path: "order-detail/:orderId",
        element: <OrderDetailPage />,
      },
      {
        path: "profile",
        element: <ProfileAdmin />,
      },
      {
        path: "statics",
        element: <ManageStatics />,
      },
      {
        path: "voucher-detail/:_id",
        element: <VoucherDetail />,
      },
    ],
  },
];

export default adminRoutes;
