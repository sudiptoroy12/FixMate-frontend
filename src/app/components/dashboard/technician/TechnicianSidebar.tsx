
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Wrench,
  ClipboardList,
  Home,
  LogOut,
  X,
  UserRound,
  UserPen,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const menuItems = [
  {
    name: "Overview",
    href: "/dashboard/technician",
    icon: LayoutDashboard,
  },
  {
    name: "Add Service",
    href: "/dashboard/technician/add-service",
    icon: PlusCircle,
  },
  {
    name: "My Services",
    href: "/dashboard/technician/my-services",
    icon: Wrench,
  },
  {
    name: "Service Requests",
    href: "/dashboard/technician/requests",
    icon: ClipboardList,
  },
];

interface TechnicianSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TechnicianSidebar({
  isOpen,
  onClose,
}: TechnicianSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully!");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#102b25] text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/dashboard/technician"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b9e769] text-[#102b25]">
              <Wrench size={22} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Fix<span className="text-[#b9e769]">Mate</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-300 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Technician Profile */}
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "Technician"}
                className="h-12 w-12 shrink-0 rounded-full border-2 border-[#b9e769] object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#b9e769] text-[#102b25]">
                <UserRound size={24} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-white">
                {user?.name || "Technician"}
              </h3>

              <p className="truncate text-xs text-white/50">
                {user?.email || "Loading email..."}
              </p>

              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#b9e769]">
                <ShieldCheck size={12} />
                Technician Account
              </span>
            </div>
          </div>

          {/* Edit Profile */}
          <Link
            href="/profile"
            onClick={onClose}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-[#b9e769] hover:bg-[#b9e769]/10 hover:text-[#b9e769]"
          >
            <UserPen size={14} />
            Edit Profile
          </Link>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Technician Panel
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard/technician" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#b9e769] text-[#102b25] shadow-lg shadow-black/10"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
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
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <Home size={19} />
            Back to Website
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
