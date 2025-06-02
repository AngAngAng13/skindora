import { Bell, Package, Plus, ShoppingCart, User, User2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import AppSidebar from "@/components/Sidebar";
import AppTable from "@/components/Table";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";

import { CardDemo } from "./components/Card";
import { CardIcon } from "./components/CardIcon";

const Admin: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <div className="relative">
            <div className="top-0 left-0 box-border w-full border-b bg-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <Typography className="text-primary text-2xl font-bold">Tổng quan</Typography>
                </div>

                <div className="flex items-center gap-4">
                  <div className="cursor-pointer rounded-lg bg-white p-2 hover:bg-gray-100">
                    <Bell size={20} />
                  </div>
                  <div className="bg-white-50 cursor-pointer rounded-3xl border-2 p-2 hover:bg-gray-100">
                    <User size={20} />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full gap-4 bg-gray-50 px-6 py-8">
              <div className="mb-6 flex justify-between">
                <Typography className="text-2xl font-bold">Bảng điều khiển</Typography>
                <div className="bg-primary hover:bg-primary/90 r rounded-lg text-white">
                  <Button className="cursor-pointer p-5">
                    <div className="flex items-center gap-4">
                      <div>
                        <Plus />
                      </div>
                      <div>
                        <span className="text-sm font-semibold">Tạo đơn hàng mới</span>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
              <div className="mb-4 flex gap-4">
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
              <div>
                <div className="w-full">
                  <div className="mb-3 flex justify-between">
                    <div>
                      <Typography className="text-lg font-medium">Đơn hàng gần đây</Typography>
                    </div>
                    <div className="mb-2">
                      <Typography className="text-primary cursor-pointer text-sm font-bold">Xem tất cả</Typography>
                    </div>
                  </div>
                  <div>
                    <AppTable />
                  </div>
                </div>
              </div>
              <div className="w-full gap-4 py-6">
                <div className="mb-4">
                  <Typography className="text-lg font-medium">Truy cập nhanh</Typography>
                </div>
                <div className="mb-4 flex gap-4">
                  <Link to="/customers" className="w-full">
                    <CardIcon icon="👥" title="Khách hàng" />
                  </Link>
                  <Link to="/products" className="w-full">
                    <CardIcon icon="📦" title="Sản phẩm" />
                  </Link>
                  <Link to="/orders" className="w-full">
                    <CardIcon icon="🛒" title="Đơn hàng" />
                  </Link>

                  <Link to="/reports" className="w-full">
                    <CardIcon icon="📊" title="Báo cáo" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
