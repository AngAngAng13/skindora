import { Outlet } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";

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
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </div>
  );
}
