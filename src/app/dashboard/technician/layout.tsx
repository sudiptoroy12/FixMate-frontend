
"use client";

import TechnicianHeader from "@/app/components/dashboard/technician/TechnicianHeader";
import TechnicianSidebar from "@/app/components/dashboard/technician/TechnicianSidebar";

import React, { useState } from "react";


export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TechnicianSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <TechnicianHeader
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
