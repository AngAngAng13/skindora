import React from "react";
import { useEffect } from "react";

import { useHeader } from "@/contexts/header.context";

const ManageOrders: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Quản Lý Đơn Hàng");
  }, []);
  return <div className="flex min-h-screen bg-white"></div>;
};

export default ManageOrders;
