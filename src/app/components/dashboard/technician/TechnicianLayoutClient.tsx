"use client";

import React, { Suspense, useState } from "react";
import TechnicianHeader from "./TechnicianHeader";
import TechnicianSidebar from "./TechnicianSidebar";

export default function TechnicianLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Suspense fallback={<div className="w-72" />}>
        <TechnicianSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </Suspense>

      <div className="min-h-screen lg:pl-72">
        <TechnicianHeader
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Dynamic page content */}
        <Suspense
          fallback={
            <main className="p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-1/3 rounded bg-surface-secondary" />
                <div className="h-32 rounded-xl bg-surface-secondary" />
              </div>
            </main>
          }
        >
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </Suspense>
      </div>
    </div>
  );
}