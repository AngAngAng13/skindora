// src/layouts/PrivateLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/Sidebar";
// Import Outlet
import { SidebarProvider } from "@/components/ui/sidebar";
// Corrected import path for NotFoundPage
import { useAuth } from "@/contexts/auth.context";
// Adjust path if needed
// Corrected import path for HeaderAdmin
import HeaderAdmin from "@/features/Admin/components/Header";
import NotFoundPage from "@/features/ErrorPage/404";

// Adjust path if needed

/**
 * PrivateLayout component
 * This component provides the main layout for authenticated admin users,
 * including the sidebar, header, and an authentication check.
 *
 * @returns {JSX.Element} The layout for admin pages or a 404 page if not authorized.
 */
const PrivateLayout: React.FC = () => {
  // Reverted component name to PrivateLayout
  const { user } = useAuth(); // Get the current user from the authentication context

  // Check if the user is authenticated and has the 'ADMIN' role
  // If not, render the NotFoundPage
  if (!user || user.role !== "ADMIN") {
    // console.log("User not authenticated or not an admin, redirecting to 404.");
    return (
      <div>
        <NotFoundPage />
      </div>
    );
  }

  // If the user is an admin, render the private layout
  return (
    <div className="flex min-h-screen bg-white">
      {/* SidebarProvider wraps the sidebar and content to manage sidebar state */}
      <SidebarProvider>
        {/* AppSidebar component provides the navigation sidebar */}
        <AppSidebar />
        {/* Main content area, takes up remaining space */}
        <div className="flex-1">
          <div className="relative">
            {/* HeaderAdmin component for the top navigation/header specific to admin */}
            <HeaderAdmin />
            {/* Outlet renders the child routes defined in your router configuration */}
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PrivateLayout;
