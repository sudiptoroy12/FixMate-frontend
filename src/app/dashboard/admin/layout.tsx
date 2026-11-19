
import React, { Suspense } from "react";
import AdminLayoutClient from "@/app/components/dashboard/admin/AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen animate-pulse bg-background" />
      }
    >
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </Suspense>
  );
}
