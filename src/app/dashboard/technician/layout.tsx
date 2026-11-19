import React, { Suspense } from "react";
import TechnicianLayoutClient from "@/app/components/dashboard/technician/TechnicianLayoutClient";

export default function TechnicianLayout({
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
      <TechnicianLayoutClient>
        {children}
      </TechnicianLayoutClient>
    </Suspense>
  );
}