import AppSidebar from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Adminpage = () => {
  return (
    <div>
      {" "}
      <div className="flex min-h-screen bg-white">
        {" "}
        <SidebarProvider>
          <AppSidebar />{" "}
          <div className="flex-1">
            <SidebarTrigger className="p-4" />{" "}
          </div>{" "}
        </SidebarProvider>{" "}
      </div>
    </div>
  );
};

export default Adminpage;
