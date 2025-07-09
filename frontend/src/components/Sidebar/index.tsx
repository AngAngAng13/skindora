import {
  BarChart4,
  Globe2,
  Home,
  // Lựa chọn thay thế: Award, Crown
  Leaf,
  // Lựa chọn thay thế: Face, Droplets
  ListChecks,
  Package,
  // Lựa chọn thay thế: LineChart, PieChart
  Shield,
  ShoppingCart,
  TicketPercent, // Lựa chọn thay thế: Ticket, Gift, Tag
  User2,
  UsersRound,
} from "lucide-react";
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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Tổng quan", url: "/admin", icon: Home },
  { title: "Hồ sơ", url: "/admin/profile", icon: User2 },
  { title: "Khách hàng", url: "/admin/customers", icon: UsersRound },
  { title: "Quản lý sản phẩm", url: "/admin/products", icon: Package },
  { title: "Quản lý đơn hàng", url: "/admin/orders", icon: ShoppingCart },
  { title: "Quản lý công dụng", url: "/admin/use", icon: ListChecks },
  { title: "Quản lý xuất xứ", url: "/admin/origin", icon: Globe2 },

  // Các icon được đề xuất thay đổi hoặc có thêm lựa chọn
  {
    title: "Thống kê",
    url: "/admin/statics",
    icon: BarChart4, // BarChart4, LineChart, PieChart trực quan hơn cho thống kê.
  },
  {
    title: "Quản lý thương hiệu",
    url: "/admin/brand",
    icon: Shield, // Shield (khiên) rất tốt, thể hiện sự bảo chứng. Award (phần thưởng) hoặc Crown (vương miện) cũng là lựa chọn hay để thể hiện thương hiệu hàng đầu.
  },
  {
    title: "Quản lý loại da",
    url: "/admin/typeskin",
    icon: Leaf, // Leaf (chiếc lá) gợi ý về sự tự nhiên, chăm sóc. Face (khuôn mặt) hoặc Droplets (giọt nước - cho dưỡng ẩm) cũng là những lựa chọn phù hợp.
  },
  {
    title: "Quản lý voucher",
    url: "/admin/voucher",
    icon: TicketPercent, // TicketPercent, Ticket (vé), Gift (quà tặng), hoặc Tag (nhãn) đều phù hợp hơn Globe2 (quả địa cầu) rất nhiều.
  },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <div className="p-2">
              <Link to="/" aria-label="Go to homepage">
                <img src={logo} alt="Skindora - Premium Skincare Products" title={"Skindora"} loading="eager" />
              </Link>
              <p className="mt-1 text-sm">Quản lý Dược Mỹ Phẩm</p>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 gap-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={`justify-start gap-3 border-0 bg-transparent ${isActive ? "bg-primary/20 text-primary" : ""} `}
                    >
                      <item.icon className="h-5 w-8" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
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
