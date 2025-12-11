import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { ClientSidebar } from "@/components/layout/ClientSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

type Props = {
  title?: string;
  children?: React.ReactNode;
};

const ClientLayout: React.FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <ClientSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className="flex-1">
          {children ?? <Outlet />}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default ClientLayout;
