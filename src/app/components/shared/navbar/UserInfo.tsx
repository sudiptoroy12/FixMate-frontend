
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import UserInfoSkeleton from "./UserInfoSkeleton";

const menuLinkClass =
  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition-all duration-200 hover:bg-[#b9e769]/10 hover:text-[#b9e769]";

const UserInfo = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const role = user?.role || "customer";

  const dashboardPath =
    role === "technician"
      ? "/dashboard/technician"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/customer";

  const menuLinks = [
    {
      label: "Dashboard",
      href: dashboardPath,
      icon: LayoutDashboard,
    },
  ];

  // Close dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();

      setIsOpen(false);
      toast.success("Successfully signed out!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  if (isPending) {
    return <UserInfoSkeleton />;
  }

  // Unauthenticated user buttons
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-[#b9e769]/40 hover:bg-white/[0.08] hover:text-[#b9e769]"
        >
          <LogIn
            size={17}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          <span className="hidden sm:inline">Login</span>
        </Link>

        <Link
          href="/signup"
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-[#b9e769] px-4 py-2.5 text-sm font-bold text-[#102b25] shadow-md shadow-[#b9e769]/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c9f17e] hover:shadow-lg hover:shadow-[#b9e769]/20 active:translate-y-0"
        >
          <UserPlus
            size={17}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="hidden sm:inline">Register</span>
        </Link>
      </div>
    );
  }

  const userName = user.name || "User";
  const userEmail = user.email || "";
  const userImage = user.image;

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Profile Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open user menu"
        className={`group flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-all duration-300 ${
          isOpen
            ? "border-[#b9e769]/50 bg-white/10 shadow-lg shadow-black/10"
            : "border-white/10 bg-white/[0.04] hover:border-[#b9e769]/40 hover:bg-white/[0.08]"
        }`}
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#b9e769]/50 bg-[#b9e769] text-sm font-bold text-[#102b25] shadow-sm">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              fill
              sizes="36px"
              className="object-cover"
            />
          ) : (
            initials
          )}
        </span>

        <span className="hidden max-w-[110px] truncate text-sm font-semibold text-white sm:block">
          {userName}
        </span>

        <ChevronDown
          size={16}
          className={`hidden text-white/60 transition-all duration-300 group-hover:text-[#b9e769] sm:block ${
            isOpen ? "rotate-180 text-[#b9e769]" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 w-72 pt-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#183a31] shadow-2xl shadow-black/30 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Top Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-[#167d68] via-[#b9e769] to-[#167d68]" />

            {/* User Information */}
            <div className="border-b border-white/10 bg-white/[0.04] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#b9e769]/50 bg-[#b9e769] text-sm font-bold text-[#102b25] shadow-md">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {userName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-white/45">
                    {userEmail}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#b9e769]/20 bg-[#b9e769]/10 px-2 py-0.5">
                    <ShieldCheck size={11} className="text-[#b9e769]" />
                    <span className="text-[10px] font-semibold capitalize tracking-wide text-[#b9e769]">
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1 p-2.5">
              {menuLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={menuLinkClass}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 transition-colors duration-200 group-hover:bg-[#b9e769]/10 group-hover:text-[#b9e769]">
                      <Icon size={16} />
                    </span>

                    {link.label}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-white/10" />

              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className={menuLinkClass}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 transition-colors duration-200 group-hover:bg-[#b9e769]/10 group-hover:text-[#b9e769]">
                  <UserRound size={16} />
                </span>

                Edit Profile
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-300 transition-all duration-200 hover:bg-red-400/10 hover:text-red-200"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/[0.08] text-red-300 transition-colors group-hover:bg-red-400/15">
                  <LogOut size={16} />
                </span>

                Sign Out
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 bg-black/[0.08] px-4 py-2.5">
              <p className="text-center text-[10px] font-medium tracking-wide text-white/30">
                FIXMATE · YOUR REPAIR PARTNER
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
