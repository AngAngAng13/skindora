import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
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
        <Toaster
          toastOptions={{
            classNames: {
              title: "text-sm font-semibold",
              description: "!text-gray-500 text-sm",

              error:
                "!border-red-200 !text-red-700  [&>[data-icon]]:text-red-500",
              success:
                "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 [&>[data-icon]]:text-green-500",
              info: "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-foreground)] dark:text-[var(--primary)] [&>[data-icon]]:text-[var(--primary)]", // Example using var()
              warning:
                "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 [&>[data-icon]]:text-yellow-500",

              actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
              cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
              closeButton: "border-border hover:bg-accent hover:text-accent-foreground",
            },
          }}
        />
      </AuthProvider>
    </div>
  );
}
