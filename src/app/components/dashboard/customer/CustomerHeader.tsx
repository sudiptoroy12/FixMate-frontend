
"use client";

import { Menu, Bell, UserRound } from "lucide-react";

interface CustomerHeaderProps {
  onMenuClick: () => void;
}

export default function CustomerHeader({
  onMenuClick,
}: CustomerHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-foreground transition hover:bg-accent lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">
            Customer Dashboard
          </h1>
          <p className="hidden text-sm text-muted sm:block">
            Manage your bookings and repair services
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          className="relative rounded-full p-2 text-foreground transition hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell size={21} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
          <UserRound size={21} />
        </div>
      </div>
    </header>
  );
}
