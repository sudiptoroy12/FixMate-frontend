
"use client";

import { Menu, Bell } from "lucide-react";

interface TechnicianHeaderProps {
  onMenuClick: () => void;
}

export default function TechnicianHeader({
  onMenuClick,
}: TechnicianHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-foreground transition hover:bg-accent lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">
            Technician Dashboard
          </h1>
          <p className="hidden text-xs text-muted sm:block">
            Manage your repair services and customer requests
          </p>
        </div>
      </div>

      <button
        className="relative rounded-xl border border-border p-2.5 text-foreground transition hover:bg-accent"
        aria-label="Notifications"
      >
        <Bell size={20} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </header>
  );
}
