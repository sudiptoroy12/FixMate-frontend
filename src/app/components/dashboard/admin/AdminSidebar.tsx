
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wrench,
  CalendarCheck,
  Wallet,
  Home,
  LogOut,
  X,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    name: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Manage Services",
    href: "/dashboard/admin/services",
    icon: Wrench,
  },
  {
    name: "Manage Bookings",
    href: "/dashboard/admin/bookings",
    icon: CalendarCheck,
  },
  {
    name: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: Wallet,
  },
];

export default function AdminSidebar({
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/signin");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#102b25] text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b9e769] text-[#102b25]">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h2 className="text-xl font-bold">FixMate</h2>
              <p className="text-xs text-white/50">Admin Panel</p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

       
{/* Admin Profile */}
<div className="border-b border-white/10 px-5 py-5">
  <div className="flex items-center gap-3">
    {user?.image ? (
      <img
        src={user.image}
        alt={user.name || "Admin"}
        className="h-12 w-12 shrink-0 rounded-full border-2 border-[#b9e769] object-cover"
      />
    ) : (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#b9e769] text-[#102b25]">
        <UserRound size={24} />
      </div>
    )}

    <div className="min-w-0 flex-1">
      <h3 className="truncate text-sm font-semibold text-white">
        {user?.name || "Admin"}
      </h3>

      <p className="truncate text-xs text-white/50">
        {user?.email || "Loading email..."}
      </p>

      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#b9e769]">
        <ShieldCheck size={12} />
        Administrator
      </span>
    </div>
  </div>

  {/* Edit Profile Button */}
  <Link
    href="/profile"
    onClick={onClose}
    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-[#b9e769] hover:bg-[#b9e769]/10 hover:text-[#b9e769]"
  >
    <UserRound size={14} />
    Edit Profile
  </Link>
</div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">
            Management
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard/admin" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#b9e769] text-[#102b25] shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Links */}
        <div className="shrink-0 space-y-2 border-t border-white/10 p-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-[#b9e769]/10 hover:text-[#b9e769]"
          >
            <Home size={19} />
            Back to Home
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
