"use client";

import SideNav from "@/app/[lang]/dashboard/components/server/sidenav";
import dashboardAppModule from "@/app/[lang]/dashboard/module/dashboard.app-module";
import { useRef } from "react";
import { ReactVVMDiProvider } from "reactvvm";

export default function Layout({ children }: { children: React.ReactNode }) {
  const di = useRef(dashboardAppModule());
  return (
    <ReactVVMDiProvider diContainer={di.current}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </ReactVVMDiProvider>
  );
}
