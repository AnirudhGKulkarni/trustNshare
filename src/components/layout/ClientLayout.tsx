import React from "react";
import { Outlet } from "react-router-dom";
import { ClientSidebar } from "@/components/layout/ClientSidebar";

type Props = {
  title?: string;
  children?: React.ReactNode;
};

const ClientLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex">
      <ClientSidebar />
      <div className="flex-1 flex flex-col">
        {children ?? <Outlet />}
      </div>
    </div>
  );
};

export default ClientLayout;
