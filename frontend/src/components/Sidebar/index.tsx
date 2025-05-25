import { ChartNoAxesColumnIncreasing, Home, Package, ShoppingCart, UsersRound } from "lucide-react";
import React, { useState } from "react";

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
  {
    title: "Tổng quan",
    url: "#",
    icon: Home,
  },
  {
    title: "Khách hàng",
    url: "#",
    icon: UsersRound,
  },
  {
    title: "Sản phẩm",
    url: "#",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    url: "#",
    icon: ShoppingCart,
  },
  {
    title: "Thống kê",
    url: "#",
    icon: ChartNoAxesColumnIncreasing,
  },
];

const AppSidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("");
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="mt-13">
              <div className="p-2">
                <h2 className="from-primary to-accent bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                  DMP Admin
                </h2>
                <p className="text-sm">Quản lý Dược Mỹ Phẩm</p>
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-17 gap-1">
              {items.map((item) => {
                const isActive = activeItem === item.title;
                return (
                  <SidebarMenuItem key={item.title}>
                    <Button
                      onClick={() => setActiveItem(item.title)}
                      variant="outline"
                      size="lg"
                      className={`ml-2 flex w-55 justify-start border-0 bg-transparent ${
                        isActive ? "bg-primary/20 text-primary" : ""
                      }`}
                    >
                      <item.icon className="mr-2" />
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
