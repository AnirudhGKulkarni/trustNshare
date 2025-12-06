import React from "react";
import { Outlet } from "react-router-dom";
import { ClientSidebar } from "@/components/layout/ClientSidebar";

const ClientLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <ClientSidebar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientLayout;
