import type { RouteObject } from "react-router-dom";

import Admin from "@/features/Admin";
import AddVoucherPage from "@/features/Admin/Voucher/AddVoucherPage";
import BrandDetail from "@/features/Admin/Brand/BrandDetail";
import UpdateBrand from "@/features/Admin/Brand/UpdateBrand";
import CreateBrand from "@/features/Admin/Brand/CreateBrand";
import ManageBrand from "@/features/Admin/ManageBrand";
import ManageUsers from "@/features/Admin/ManageCustomer";
import ManageOrders from "@/features/Admin/ManageOrders";
import ManageProducts from "@/features/Admin/ManageProduct";
import ManageVoucher from "@/features/Admin/ManageVoucher";
import OrderDetailPage from "@/features/Admin/Order/OrderDetailPage";
import ManageOrigin from "@/features/Admin/Origin/ManageOrigin";
import ProductDetail from "@/features/Admin/Product/ProductDetail";
import UpdateDetailProduct from "@/features/Admin/Product/UpdateDetail";
import ProfileAdmin from "@/features/Admin/ProfileAdmin";
import ManageSkin from "@/features/Admin/Skin/ManageSkin";
import ManageStatics from "@/features/Admin/Statics/ManageStatics";
import ManageUse from "@/features/Admin/Uses/ManageUse";
import UpdateVoucher from "@/features/Admin/Voucher/UpdateVoucher";
import VoucherDetail from "@/features/Admin/Voucher/VoucherDetail";
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
        path: "create-brand",
        element: <CreateBrand />,
      },
      {
        path: ":id/update-brand",
        element: <UpdateBrand />,
      },
      {
        path: ":id/detail-brand",
        element: <BrandDetail />,
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
