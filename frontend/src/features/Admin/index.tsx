import { Package, ShoppingCart, User2 } from "lucide-react";
import React from "react";

import AppSidebar from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { CardDemo } from "./components/Card";

const Admin: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <SidebarTrigger className="p-6" />
          <div className="w-full gap-4 bg-gray-100 p-4">
            <h1 className="mb-4 text-2xl font-bold">Bảng điều khiển</h1>
            <div className="flex gap-4">
              <CardDemo title="Tổng doanh thu" amount="128,430,000₫" change="+20.1% so với tháng trước" />
              <CardDemo
                title="Đơn hàng"
                amount="+573"
                change="+20.1% so với tháng trước"
                icon={<ShoppingCart size={15} />}
              />
              <CardDemo title="Sản phẩm" amount="850" change="+24 sản phẩm mới" icon={<Package size={15} />} />
              <CardDemo title="Khách hàng" amount="+2,340" change="+180 khách hàng mới" icon={<User2 size={15} />} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
