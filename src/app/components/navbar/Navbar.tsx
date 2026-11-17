
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Wrench,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  LogOut,
  Settings,
  Home,
  Info,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import ThemeToggle from "../theme/ThemeToggle";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about", icon: Info },
];

const dashboardRoutes: Record<string, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

const Navbar = () => {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const role =
    (user as typeof user & { role?: string })?.role?.toLowerCase() ||
    "customer";

  const dashboardLink =
    dashboardRoutes[role] || "/dashboard/customer";

  const userName = user?.name || "User";
  const userImage = user?.image;

  // Close menus
  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  // Active route detection
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Navigation styles
  const getNavClass = (active: boolean) =>
    `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
      active
        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
    }`;

  // Sign out
  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      closeMenus();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95">

      {/* Main Navbar */}
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="FixMate home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-all duration-300 group-hover:rotate-6 group-hover:scale-105 sm:h-11 sm:w-11">
            <Wrench size={25} strokeWidth={2.2} />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            Fix
            <span className="text-blue-600">Mate</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                aria-current={active ? "page" : undefined}
                className={getNavClass(active)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Logged Out */}
          {!isPending && !user && (
            <>
              <Link
                href="/signin"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Logged In */}
          {!isPending && user && (
            <div className="relative">

              {/* Profile Button */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-xl border border-gray-200 p-1.5 pr-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-9 w-9 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <UserRound size={20} />
                  </span>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {userName}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                    <p className="truncate font-bold text-gray-900 dark:text-white">
                      {userName}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      {role}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link
                      href={dashboardLink}
                      onClick={closeMenus}
                      role="menuitem"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      role="menuitem"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                    >
                      <Settings size={18} />
                      Update Profile
                    </Link>

                    <button
                      onClick={handleSignOut}
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">

          {/* Mobile Theme Toggle */}
          <ThemeToggle />

          {/* Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg dark:border-gray-800 dark:bg-gray-950 md:hidden">

          {/* Navigation Links */}
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  aria-current={active ? "page" : undefined}
                  className={getNavClass(active)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Authentication */}
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">

            {/* Logged Out */}
            {!isPending && !user && (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={closeMenus}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenus}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Logged In */}
            {!isPending && user && (
              <div className="space-y-2">

                {/* User Information */}
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={userName}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                      <UserRound size={22} />
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900 dark:text-white">
                      {userName}
                    </p>

                    <span className="text-xs font-semibold capitalize text-blue-600 dark:text-blue-400">
                      {role}
                    </span>
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  href={dashboardLink}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                >
                  <LayoutDashboard size={19} />
                  Dashboard
                </Link>

                {/* Update Profile */}
                <Link
                  href="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                >
                  <Settings size={19} />
                  Update Profile
                </Link>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut size={19} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
