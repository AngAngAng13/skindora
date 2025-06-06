import { ChartNoAxesColumnIncreasing, Home, Package, ShoppingCart, UsersRound } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from "@/assets/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "../ui/button";

const items = [
  { title: "Tổng quan", url: "/admin", icon: Home },
  { title: "Khách hàng", url: "/admin/customers", icon: UsersRound },
  { title: "Sản phẩm", url: "/admin/products", icon: Package },
  { title: "Đơn hàng", url: "/admin/orders", icon: ShoppingCart },
  { title: "Thống kê", url: "/admin/statics", icon: ChartNoAxesColumnIncreasing },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <div className="p-2">
              <Link to="/" aria-label="Go to homepage">
                <img src={logo} alt="Skindora - Premium Skincare Products" title={"Skindora"} loading="eager" />
              </Link>
              {/* <h2 className="from-primary to-accent bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                Skin Dora
              </h2> */}
              <p className="mt-1 text-sm">Quản lý Dược Mỹ Phẩm</p>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 gap-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <Button
                      onClick={() => navigate(item.url)}
                      variant="outline"
                      size="lg"
                      className={`ml-2 flex w-52 justify-start border-0 bg-transparent ${
                        isActive ? "bg-primary/20 text-primary" : ""
                      }`}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
