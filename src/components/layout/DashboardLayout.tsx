import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-0" : "ml-64"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
