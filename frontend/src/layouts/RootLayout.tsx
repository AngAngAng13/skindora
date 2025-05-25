import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout() {
  return (
    // <div className="flex min-h-screen bg-white">
    //   <SidebarProvider>
    //     <AppSidebar />
    //     <div className="flex-1">
    //       <SidebarTrigger className="p-4" />
    //       <Outlet />
    //     </div>
    //   </SidebarProvider>
    // </div>
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
}
