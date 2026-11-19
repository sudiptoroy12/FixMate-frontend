
"use client";

import { Menu, Bell, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-border p-2 text-foreground hover:bg-surface-hover lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">
            Admin Dashboard
          </h1>
          <p className="hidden text-xs text-muted sm:block">
            Manage your FixMate platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative rounded-xl border border-border p-2.5 text-muted transition hover:bg-surface-hover"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 rounded-xl bg-surface-secondary px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck size={19} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">
              Administrator
            </p>
            <p className="text-xs text-muted">
              Admin Account
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
