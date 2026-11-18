
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarCheck,
  UserRound,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import UserInfoSkeleton from "./UserInfoSkeleton";

const menuLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "My Bookings",
    href: "/my-bookings",
    icon: CalendarCheck,
  },
];

const menuLinkClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-[#b9e769]";

const UserInfo = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

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
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/10 hover:text-[#b9e769]"
        >
          <LogIn size={17} />
          <span className="hidden sm:inline">Login</span>
        </Link>

        <Link
          href="/signup"
          className="flex items-center gap-1.5 rounded-xl bg-[#b9e769] px-3 py-2 text-sm font-semibold text-[#102b25] shadow-sm shadow-black/10 transition hover:bg-[#c9f17e]"
        >
          <UserPlus size={17} />
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
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 transition hover:border-[#b9e769]/50 hover:bg-white/10"
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#b9e769] text-sm font-bold text-[#102b25]">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            initials
          )}
        </span>

        <span className="hidden max-w-[100px] truncate text-sm font-semibold text-white sm:block">
          {userName}
        </span>

        <ChevronDown
          size={16}
          className={`hidden text-gray-300 transition-transform duration-200 sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 w-64 pt-2">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#183a31] shadow-xl shadow-black/30">

            {/* User Information */}
            <div className="border-b border-white/10 bg-white/5 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#b9e769] text-sm font-bold text-[#102b25]">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {userName}
                  </p>

                  <p className="truncate text-xs text-gray-400">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1 p-2">
              {menuLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={menuLinkClass}
                  >
                    <Icon size={17} />
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
                <UserRound size={17} />
                My Profile
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
