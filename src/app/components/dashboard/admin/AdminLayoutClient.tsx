
"use client";

import React, { Suspense, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="w-72" />}>
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </Suspense>

      <div className="min-h-screen lg:pl-72">
        <AdminHeader
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <Suspense
          fallback={
            <main className="p-4 sm:p-6 lg:p-8">
              <div className="h-32 animate-pulse rounded-xl bg-surface-secondary" />
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
