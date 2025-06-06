import React, { useEffect } from "react";

import { useHeader } from "@/contexts/header.context";

const ManageProducts: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Quản Lý Sản Phẩm");
  }, []);
  return <div className="flex min-h-screen bg-white"></div>;
};

export default ManageProducts;
