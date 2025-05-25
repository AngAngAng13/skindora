import {
  Calendar,
  ChartNoAxesColumnIncreasing,
  Home,
  Inbox,
  Package,
  Search,
  Settings,
  ShoppingCart,
  UsersRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "../ui/button";

// Menu items.
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

export function AppSidebar() {
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div>
                    <div className="">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="ml-2 flex w-55 justify-start border-0 bg-transparent"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Button>
                    </div>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
export default AppSidebar;
